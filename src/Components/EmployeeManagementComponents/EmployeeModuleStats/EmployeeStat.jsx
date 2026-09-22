import "./EmployeeStat.css";


function EmployeeStat({
    stats
}) {

    return (

        <div className="employee-stats">
            {stats.map((stat, index) => {

                const Icon = stat.icon;

                return (
                    <div
                        className="employee-stat-card"
                        key={index}
                    >

                        <div className="employee-stat-content">

                            <span className="employee-stat-title">
                                {stat.title}
                            </span>

                            <strong className="employee-stat-value">
                                {stat.value}
                            </strong>

                        </div>


                    {/* ============= STAT ICON ========== */}

                        <div className="employee-stat-icon">
                            {Icon && (
                                <Icon
                                    size={32}
                                    strokeWidth={1.8}
                                />
                            )}
                        </div>
                    </div>
                );
            })}
        </div>

    );

}


export default EmployeeStat;