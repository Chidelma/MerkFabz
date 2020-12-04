import React, { useState } from 'react'
import {_models, _role } from '../../scripts/Models';
import User from '../../scripts/User';
import './Users.css';

interface users { users : User[] }

export default function Users(props:_models) {

    let user_results:User[] = [];

    const [searching, setSearching] = useState(false);
    const [results, setResults] = useState(user_results);
    const [user, setUser] = useState(props.users[0]);
    const [userIdx, setUserIdx] = useState(0);
    const [editing, setEditing] = useState(false);
    const [loading, setLoading] = useState(false);

    const User = ({users}:users) => {

        const edit_user = (user:User, idx:number) => {
            setUser(user);
            setUserIdx(idx);
            setEditing(true);
        }

        return (
            <>
                {users.map((user, idx) => (
                    <div className="user-det">
                        <h5>{user.get_name()}</h5>
                        <hr/>
                        <table>
                            <tr>
                                <th>Action</th>
                                <th>Policy</th>
                            </tr>
                            <tr>
                                <td>View Products</td>
                                <td>{user.get_role().can_view_items() ? "Yes" : "No"}</td>
                            </tr>
                            <tr>
                                <td>View Orders</td>
                                <td>{user.get_role().can_view_orders() ? "Yes" : "No"}</td>
                            </tr>
                            <tr>
                                <td>View Users</td>
                                <td>{user.get_role().can_view_users() ? "Yes" : "No"}</td>
                            </tr>
                            <tr>
                                <td>Add Products</td>
                                <td>{user.get_role().can_add_item() ? "Yes" : "No"}</td>
                            </tr>
                            <tr>
                                <td>Edit Products</td>
                                <td>{user.get_role().can_edit_item() ? "Yes" : "No"}</td>
                            </tr>
                            <tr>
                                <td>Delete Products</td>
                                <td>{user.get_role().can_delete_item() ? "Yes" : "No"}</td>
                            </tr>
                            <tr>
                                <td>Edit Roles</td>
                                <td>{user.get_role().can_edit_role() ? "Yes" : "No"}</td>
                            </tr>
                        </table>
        
                        <hr/>
        
                        <button className="btn btn-light up-btn" onClick={() => edit_user(user, idx)}>Edit Policy</button>
                    </div>
                ))}
            </>
        )
    }

    const search_user = (search_term:string) => {
        setSearching(true);
        setResults(props.users.filter((user) => user.get_name().includes(search_term) || user.get_email().includes(search_term)))
    }

    const updateUserPolicy = async (e:Event) => {

        e.preventDefault();

        setLoading(true)

        let role:_role = {

            id: user.get_id(),

            can_add_item: user.get_role().can_add_item(),
            can_edit_item: user.get_role().can_edit_item(),
            can_delete_item: user.get_role().can_delete_item(),
            can_view_items: user.get_role().can_view_items(),
            can_view_orders: user.get_role().can_view_orders(),
            can_view_users: user.get_role().can_view_users(),

            can_edit_role: user.get_role().can_edit_role()
        }

        let added:boolean = await props.store.addData("ROLES", role);

        if(added) {
            props.users[userIdx].set_role(role);
            setEditing(false);
        }

        setLoading(false);
    }

    return (
        <div id="users">
            <div className="input-group mb-3 user-search-bar">
                <input type="text" className="form-control form-control-lg search-inp" onChange={(e) => search_user(e.target.value)} placeholder="Search Users" />
                <div className="input-group-append">
                    <button className="btn btn-light" onClick={() => setSearching(false)}>Reset</button>
                </div>
            </div>
            {searching ? <User users={results}/> : <User users={props.users}/> }
            {editing && 
                <form id="policy-edit">
                    <h5>{user.get_name()}'s Policy</h5>
                    <hr/>

                    <table>
                        <tr>
                            <th>Action</th>
                            <th>Policy</th>
                        </tr>
                        <tr>
                            <td>View Products</td>
                            <td>
                                <select className="custom-select custom-select-sm" onChange={(e) => user.get_role().set_view_items(e.target.value === "true")}>
                                    <option value={String(user.get_role().can_view_items())}>{user.get_role().can_view_items() ? "Yes" : "No"}</option>
                                    <option value={String(!user.get_role().can_view_items())}>{!user.get_role().can_view_items() ? "Yes" : "No"}</option>
                                </select>
                            </td>
                        </tr>
                        <tr>
                            <td>View Orders</td>
                            <td>
                                <select className="custom-select custom-select-sm" onChange={(e) => user.get_role().set_view_orders(e.target.value === "true")}>
                                    <option value={String(user.get_role().can_view_orders())}>{user.get_role().can_view_orders() ? "Yes" : "No"}</option>
                                    <option value={String(!user.get_role().can_view_orders())}>{!user.get_role().can_view_orders() ? "Yes" : "No"}</option>
                                </select>
                            </td>
                        </tr>
                        <tr>
                            <td>View Users</td>
                            <td>
                                <select className="custom-select custom-select-sm" onChange={(e) => user.get_role().set_view_users(e.target.value === "true")}>
                                    <option value={String(user.get_role().can_view_users())}>{user.get_role().can_view_users() ? "Yes" : "No"}</option>
                                    <option value={String(!user.get_role().can_view_users())}>{!user.get_role().can_view_users() ? "Yes" : "No"}</option>
                                </select>
                            </td>
                        </tr>
                        <tr>
                            <td>Add Products</td>
                            <td>
                                <select className="custom-select custom-select-sm" onChange={(e) => user.get_role().set_add_item(e.target.value === "true")}>
                                    <option value={String(user.get_role().can_add_item())}>{user.get_role().can_add_item() ? "Yes" : "No"}</option>
                                    <option value={String(!user.get_role().can_add_item())}>{!user.get_role().can_add_item() ? "Yes" : "No"}</option>
                                </select>
                            </td>
                        </tr>
                        <tr>
                            <td>Edit Products</td>
                            <td>
                                <select className="custom-select custom-select-sm" onChange={(e) => user.get_role().set_edit_item(e.target.value === "true")}>
                                    <option value={String(user.get_role().can_edit_item())}>{user.get_role().can_edit_item() ? "Yes" : "No"}</option>
                                    <option value={String(!user.get_role().can_edit_item())}>{!user.get_role().can_edit_item() ? "Yes" : "No"}</option>
                                </select>
                            </td>
                        </tr>
                        <tr>
                            <td>Delete Products</td>
                            <td>
                                <select className="custom-select custom-select-sm" onChange={(e) => user.get_role().set_delete_item(e.target.value === "true")}>
                                    <option value={String(user.get_role().can_delete_item())}>{user.get_role().can_delete_item() ? "Yes" : "No"}</option>
                                    <option value={String(!user.get_role().can_delete_item())}>{!user.get_role().can_delete_item() ? "Yes" : "No"}</option>
                                </select>
                            </td>
                        </tr>
                        <tr>
                            <td>Edit Roles</td>
                            <td>
                                <select className="custom-select custom-select-sm" onChange={(e) => user.get_role().set_edit_role(e.target.value === "true")}>
                                    <option value={String(user.get_role().can_edit_role())}>{user.get_role().can_edit_role() ? "Yes" : "No"}</option>
                                    <option value={String(!user.get_role().can_edit_role())}>{!user.get_role().can_edit_role() ? "Yes" : "No"}</option>
                                </select>
                            </td>
                        </tr>
                    </table>
    
                    <hr/>

                    <button className="btn btn-danger" onClick={() => setEditing(false)}>Cancel</button>
                    <button className="btn btn-light up-btn" onClick={(e:any) => updateUserPolicy(e)}>{loading ? <i className="fa fa-spinner fa-spin"></i> : "Update"}</button>
                </form>
            }
        </div>
    )
}