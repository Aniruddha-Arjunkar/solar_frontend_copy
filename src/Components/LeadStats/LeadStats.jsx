import "./LeadStats.css";


function LeadStats({
    stats
}) {

    return (

        <div className="lead-stats">

            {stats.map((stat, index) => (

                <div
                    className="lead-stat-card"
                    key={index}
                >

                    <span className="lead-stat-title">

                        {stat.title}

                    </span>


                    <strong className="lead-stat-value">

                        {stat.value}

                    </strong>

                </div>

            ))}

        </div>

    );

}


export default LeadStats;