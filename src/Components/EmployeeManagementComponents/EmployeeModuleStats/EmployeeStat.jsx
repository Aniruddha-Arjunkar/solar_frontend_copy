import "./EmployeeStat.css";


function EmployeeStat({
    stats
}) {

    return (

        <div className="employee-stats">

            {stats.map((stat, index) => (

                <div
                    className="employee-stat-card"
                    key={index}
                >

                    <span className="employee-stat-title">

                        {stat.title}

                    </span>


                    <strong className="employee-stat-value">

                        {stat.value}

                    </strong>

                </div>

            ))}

        </div>

    );

}


export default EmployeeStat;