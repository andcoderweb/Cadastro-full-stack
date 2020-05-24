import React, { Component } from 'react'
import axios from 'axios'
import Main from '../template/Main'
const headerProps = {
    icon: "users",
    title: "Users",
    subtitle: "CRUD"
}
const baseUrl = "http://localhost:3001/users"
const initialState = {
    user: { name: '', email: '', age: '', telephone: '' },
    list: []
}
export default class UserCrud extends Component {
    state = { ...initialState }

    componentWillMount() {
        axios(baseUrl).then(resp => {
            this.setState({ list: resp.data })
        })
    }

    clear() {
        this.setState({ user: initialState.user })
    }
    save() {
        const user = this.state.user
        const method = user.id ? 'put' : 'post'
        const url = user.id ? `${baseUrl}/${user.id}` : baseUrl
        axios[method](url, user)
            .then(resp => {
                const list = this.getUpdatedList(resp.data)
                this.setState({ user: initialState.user, list })
            })

    }
    getUpdatedList(user,add=true) {
        const list = this.state.list.filter(u => u.id !== user.id)
        if (add) list.unshift(user)
        return list
    }
    updateField(event) {
        const user = { ...this.state.user }
        user[event.target.name] = event.target.value
        this.setState({ user })

    }

    renderForm() {
        return (
            <div className="form">
                <div className="row">
                    <div className="col-12 col-md-6">
                        <div className="form-group">
                            <label>Name</label> <i class="fas fa-user-tie"></i>
                            <input type="text" className="form-control"
                                name="name" value={this.state.user.name}
                                onChange={e => this.updateField(e)}
                                placeholder="Write your full name"
                                required />
                        </div>
                    </div>
                    <div className="col-12 col-md-6">
                        <div className="form-group">
                            <label>Email</label>
                            <input type="email" className="form-control"
                                name="email" value={this.state.user.email}
                                onChange={e => this.updateField(e)}
                                placeholder="Write your Email"
                                required />
                        </div>
                    </div>

                </div>
                <div className="row">
                    <div className="col-12 col-md-6">
                        <div className="form-group">
                            <label>Age</label>
                            <input type="date" className="form-control"
                                name="age" value={this.state.user.age}
                                onChange={e => this.updateField(e)}

                                required />
                        </div>
                    </div>
                    <div className="col-12 col-md-6">
                        <div className="form-group">
                            <label>Phone</label>
                            <input type="text" className="form-control"
                                name="telephone" value={this.state.user.telephone}
                                onChange={e => this.updateField(e)}

                                required />
                        </div>
                    </div>

                </div>
                <hr />
                <div className="row">
                    <div className="col-12 d-flex justify-content-end">
                        <button className="btn btn-primary"
                            onClick={e => this.save(e)}>
                            Save
                        </button>
                        <button className="btn btn-secondary ml-2"
                            onClick={e => this.clear(e)}>
                            Cancel
                        </button>
                    </div>
                </div>
            </div>


        )
    }

    load(user) {
        this.setState({ user })
    }

    remove(user) {
        axios.delete(`${baseUrl}/${user.id}`).then(resp => {
            const list = this.getUpdatedList(resp.data)
            this.setState({ list })
        })
    }
    renderTable() {
        return (
            <table className="table-mt-4">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Age</th>
                        <th>Phone</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {this.renderRows()}
                </tbody>
            </table>
        )
    }
    renderRows() {
        return this.state.list.map(user => {
            return (
                <tr key={user.id}>
                    <td>{user.id}</td>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td>{user.age}</td>
                    <td>{user.telephone}</td>
                    <td>
                        <button className="btn btn-warning"
                            onClick={() => this.load(user,false)}>
                            <i className="fa fa-pencil"></i>

                        </button>

                        <button className="btn btn-danger mt-2"
                            onClick={() => this.remove(user)}>
                            <i className="fa fa-trash"></i>

                        </button>

                    </td>

                </tr>
            )
        })
    }

    render() {
        return (
            <Main {...headerProps}>
                {this.renderForm()}
                {this.renderTable()}
            </Main>
        )
    }
}