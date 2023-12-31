    
import React, { Component } from 'react'
import { BarChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, Bar } from 'recharts'
import "../style/analytics.css"


class SalesChart extends Component {
    constructor() {
        super()
        this.state = {
            selection: "month",
        }
    }

    handleSelection = e => this.setState({ selection: e.target.value })

    getMonth = date => new Intl.DateTimeFormat('en-US', { month: "short" }).format(date)

    sortMonths = monthsArr => {
        const monthsOrder = {
            "Jan": 1,
            "Feb": 2,
            "Mar": 3,
            "Apr": 4,
            "May": 5,
            "Jun": 6,
            "Jul": 7,
            "Aug": 8,
            "Sep": 9,
            "Oct": 10,
            "Nov": 11,
            "Dec": 12
        }

        return monthsArr.sort((a, b) => monthsOrder[a] - monthsOrder[b])
    }

    createDataObject = (clients, selection) => {
        let dataObj = {}

        for (let client of clients) {

            if (client.sold) {
                if (selection === "firstContact") {
                    let date = this.getMonth(new Date(client[selection]))
                    dataObj[date] ? dataObj[date]++ : dataObj[date] = 1
                } else {
                    dataObj[client[selection]] ? dataObj[client[selection]]++ : dataObj[client[selection]] = 1
                }
            }
        }

        return dataObj
    }

    generateSalesByDataPoint = (data, selection) => {

        let dataObj = this.createDataObject(data, selection)
        let dataArr = []
        let dataKeys = selection === "firstContact" ? this.sortMonths(Object.keys(dataObj)) : Object.keys(dataObj)

        for (let item of dataKeys) {
            dataArr.push({ name: item.split(" ")[0], sales: dataObj[item] })
        }

        return dataArr
    }

    getChartDataBySelection = () => {
        let data = this.props.data
        if (this.state.selection === "country") {
            return this.generateSalesByDataPoint(data, "country")
        } else if (this.state.selection === "email") {
            return this.generateSalesByDataPoint(data, "emailType")
        } else if (this.state.selection === "month") {
            return this.generateSalesByDataPoint(data, "firstContact")
        } else if (this.state.selection === "owner") {
            return this.generateSalesByDataPoint(data, "owner")
        }
    }

    render() {

        const data = this.getChartDataBySelection()

        return (
            <div id="sales-by" className="chart">
                <span id = "salesBy">Sales By:</span>
                <select
                 id="sales-by-selection"
                 value={this.state.selection}
                onChange={this.handleSelection}
                className="selectInput"> 
                    <option value="country">Country</option>
                    <option value="email">Email</option>
                    <option value="month">Month</option>
                    <option value="owner">Owner</option>
                </select>

                <BarChart width={600} height={200} data={data}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="sales" fill="#955196" />
                </BarChart>

            </div>
        )
    }
}
export default SalesChart