import { useEffect, useRef, useState } from "react";

import {
    FileText,
    Upload,
    Eye,
    Trash2,
    X,
    LoaderCircle
} from "lucide-react";

import "./ClientDocumentSection.css";


//====================================================
// CLIENT DOCUMENTS SECTION
//====================================================

function ClientDocumentsSection({ clientId }) {

    //================================================
    // STATES
    //================================================

    const [documents, setDocuments] = useState([]);

    const [selectedFile, setSelectedFile] = useState(null);

    const [showUploadForm, setShowUploadForm] =
        useState(false);

    const [loading, setLoading] =
        useState(false);

    const [uploading, setUploading] =
        useState(false);

    const fileInputRef = useRef(null);


    //================================================
    // FETCH DOCUMENTS
    //================================================

    const fetchDocuments = async () => {

        if (!clientId) {
            return;
        }

        setLoading(true);

        try {

            const response = await fetch(
                `http://localhost:8080/api/client-documents/client/${clientId}`
            );

            if (!response.ok) {
                throw new Error(
                    "Failed to fetch client documents."
                );
            }

            const data = await response.json();

            setDocuments(data);

        } catch (error) {

            console.error(
                "Error fetching documents:",
                error
            );

        } finally {

            setLoading(false);
        }
    };


    //================================================
    // LOAD DOCUMENTS
    //================================================

    useEffect(() => {

        fetchDocuments();

    }, [clientId]);


    //================================================
    // SELECT FILE
    //================================================

    const handleFileChange = (event) => {

        const file =
            event.target.files?.[0];

        if (!file) {
            return;
        }


        //============================================
        // CHECK FILE TYPE
        //============================================

        const allowedTypes = [
            "application/pdf",
            "image/jpeg",
            "image/png"
        ];

        const allowedExtensions = [
            ".pdf",
            ".jpg",
            ".jpeg",
            ".png"
        ];

        const fileName =
            file.name.toLowerCase();

        const validType =
            allowedTypes.includes(file.type);

        const validExtension =
            allowedExtensions.some(
                extension =>
                    fileName.endsWith(extension)
            );


        if (!validType && !validExtension) {

            alert(
                "Only PDF, JPG, JPEG and PNG files are allowed."
            );

            event.target.value = "";

            return;
        }


        //============================================
        // FILE SIZE CHECK
        //============================================

        const maxFileSize =
            10 * 1024 * 1024;

        if (file.size > maxFileSize) {

            alert(
                "File size must be less than 10 MB."
            );

            event.target.value = "";

            return;
        }


        setSelectedFile(file);
    };


    //================================================
    // UPLOAD DOCUMENT
    //================================================

    const handleUpload = async (event) => {

        event.preventDefault();

        if (!selectedFile || uploading) {
            return;
        }

        setUploading(true);

        try {

            const formData =
                new FormData();

            formData.append(
                "file",
                selectedFile
            );


            const response = await fetch(
                `http://localhost:8080/api/client-documents/client/${clientId}`,
                {
                    method: "POST",
                    body: formData
                }
            );


            if (!response.ok) {

                throw new Error(
                    "Failed to upload document."
                );
            }


            await response.json();


            //========================================
            // RESET FORM
            //========================================

            setSelectedFile(null);

            if (fileInputRef.current) {
                fileInputRef.current.value = "";
            }

            setShowUploadForm(false);


            //========================================
            // REFRESH DOCUMENT LIST
            //========================================

            await fetchDocuments();

        } catch (error) {

            console.error(
                "Error uploading document:",
                error
            );

            alert(
                "Unable to upload document."
            );

        } finally {

            setUploading(false);
        }
    };


    //================================================
    // VIEW DOCUMENT
    //================================================

    const handleViewDocument = (documentId) => {

        const documentUrl =
            `http://localhost:8080/api/client-documents/${documentId}/view`;

        window.open(
            documentUrl,
            "_blank",
            "noopener,noreferrer"
        );
    };


    //================================================
    // DELETE DOCUMENT
    //================================================

    const handleDeleteDocument = async (document) => {

        const confirmed =
            window.confirm(
                `Are you sure you want to delete "${document.fileName}"?`
            );


        if (!confirmed) {
            return;
        }


        try {

            const response = await fetch(
                `http://localhost:8080/api/client-documents/${document.id}`,
                {
                    method: "DELETE"
                }
            );


            if (!response.ok) {

                throw new Error(
                    "Failed to delete document."
                );
            }


            await fetchDocuments();

        } catch (error) {

            console.error(
                "Error deleting document:",
                error
            );

            alert(
                "Unable to delete document."
            );
        }
    };


    //================================================
    // FORMAT FILE SIZE
    //================================================

    const formatFileSize = (bytes) => {

        if (!bytes) {
            return "0 KB";
        }

        const mb =
            bytes / (1024 * 1024);

        if (mb >= 1) {
            return `${mb.toFixed(2)} MB`;
        }

        return `${Math.ceil(bytes / 1024)} KB`;
    };


    //================================================
    // CLOSE UPLOAD FORM
    //================================================

    const handleCloseUpload = () => {

        setShowUploadForm(false);

        setSelectedFile(null);

        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };


    //================================================
    // RENDER
    //================================================

    return (

        <section className="client-documents-section">

            {/*================================================
                HEADER
            =================================================*/}

            <div className="client-documents-header">

                <div className="client-documents-heading">

                    <FileText size={22} />

                    <div>

                        <h3>
                            Documents
                        </h3>

                        <p>
                            Upload and manage client documents.
                        </p>

                    </div>

                </div>


                <button
                    type="button"
                    className="client-document-upload-button"
                    onClick={() =>
                        setShowUploadForm(true)
                    }
                >

                    <Upload size={18} />

                    <span>
                        Upload Document
                    </span>

                </button>

            </div>


            {/*================================================
                UPLOAD FORM
            =================================================*/}

            {showUploadForm && (

                <div className="client-document-upload-form">

                    <div className="client-document-upload-form-header">

                        <h4>
                            Upload Document
                        </h4>

                        <button
                            type="button"
                            onClick={handleCloseUpload}
                        >
                            <X size={20} />
                        </button>

                    </div>


                    <form onSubmit={handleUpload}>

                        <div className="client-document-file-input">

                            <input
                                ref={fileInputRef}
                                type="file"
                                accept=".pdf,.jpg,.jpeg,.png"
                                onChange={handleFileChange}
                            />

                            <small>
                                Allowed: PDF, JPG, JPEG, PNG
                                {" • "}
                                Maximum 10 MB
                            </small>

                        </div>


                        {selectedFile && (

                            <div className="selected-document">

                                <FileText size={18} />

                                <span>
                                    {selectedFile.name}
                                </span>

                                <small>
                                    {formatFileSize(
                                        selectedFile.size
                                    )}
                                </small>

                            </div>

                        )}


                        <div className="client-document-upload-actions">

                            <button
                                type="button"
                                className="client-document-cancel-button"
                                onClick={handleCloseUpload}
                                disabled={uploading}
                            >
                                Cancel
                            </button>


                            <button
                                type="submit"
                                className="client-document-save-button"
                                disabled={
                                    !selectedFile ||
                                    uploading
                                }
                            >

                                {uploading ? (

                                    <>
                                        <LoaderCircle
                                            size={17}
                                            className="document-loading-icon"
                                        />

                                        Uploading...

                                    </>

                                ) : (

                                    <>
                                        <Upload size={17} />

                                        Upload

                                    </>
                                )}

                            </button>

                        </div>

                    </form>

                </div>
            )}


            {/*================================================
                DOCUMENT LIST
            =================================================*/}

            <div className="client-documents-list">

                {loading ? (

                    <div className="client-documents-message">

                        Loading documents...

                    </div>

                ) : documents.length === 0 ? (

                    <div className="client-documents-empty">

                        <FileText size={35} />

                        <p>
                            No documents uploaded yet.
                        </p>

                        <span>
                            Upload Aadhaar, PAN,
                            Passbook or other client documents.
                        </span>

                    </div>

                ) : (

                    <div className="client-documents-table-wrapper">

                        <table className="client-documents-table">

                            <thead>

                                <tr>

                                    <th>
                                        #
                                    </th>

                                    <th>
                                        Document Name
                                    </th>

                                    <th>
                                        File Type
                                    </th>

                                    <th>
                                        Size
                                    </th>

                                    <th>
                                        Uploaded At
                                    </th>

                                    <th>
                                        Action
                                    </th>

                                </tr>

                            </thead>


                            <tbody>

                                {documents.map(
                                    (document, index) => (

                                        <tr
                                            key={
                                                document.id
                                            }
                                        >

                                            <td>
                                                {index + 1}
                                            </td>

                                            <td>

                                                <div className="document-name-cell">

                                                    <FileText
                                                        size={18}
                                                    />

                                                    <span>
                                                        {
                                                            document.fileName
                                                        }
                                                    </span>

                                                </div>

                                            </td>

                                            <td>
                                                {
                                                    document.fileType
                                                }
                                            </td>

                                            <td>
                                                {
                                                    formatFileSize(
                                                        document.fileSize
                                                    )
                                                }
                                            </td>

                                            <td>
                                                {
                                                    document.uploadedAt
                                                        ? new Date(
                                                            document.uploadedAt
                                                        ).toLocaleString()
                                                        : "-"
                                                }
                                            </td>

                                            <td>

                                                <div className="document-actions">

                                                    <button
                                                        type="button"
                                                        className="document-view-button"
                                                        title="View Document"
                                                        onClick={() =>
                                                            handleViewDocument(
                                                                document.id
                                                            )
                                                        }
                                                    >
                                                        <Eye
                                                            size={17}
                                                        />
                                                    </button>


                                                    <button
                                                        type="button"
                                                        className="document-delete-button"
                                                        title="Delete Document"
                                                        onClick={() =>
                                                            handleDeleteDocument(
                                                                document
                                                            )
                                                        }
                                                    >
                                                        <Trash2
                                                            size={17}
                                                        />
                                                    </button>

                                                </div>

                                            </td>

                                        </tr>

                                    )
                                )}

                            </tbody>

                        </table>

                    </div>

                )}

            </div>

        </section>
    );
}

export default ClientDocumentsSection;