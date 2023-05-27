import React from 'react';
import {Button, Form, Input} from 'antd';
import axios from "axios";
import {BASE_URL, ENCRIPTED_KEY} from "../api/host";
import {message} from "antd";
import { AES } from 'crypto-js';
import {useNavigate} from "react-router-dom";



const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo);
};
const Register: React.FC = () => {
    const navigate = useNavigate()
    const onFinish = (values: any) => {
        console.log('Success:', values);
        axios.post(`${BASE_URL}/signup`, values).then(res => {
            console.log(res)
            message.success('You are registered successfully!')
            localStorage.setItem('secret', AES.encrypt(res.data.data.secret, ENCRIPTED_KEY).toString())
            localStorage.setItem('key', AES.encrypt(res.data.data.key, ENCRIPTED_KEY).toString())
            navigate('/books')
            // axios.get(`${BASE_URL}/books`, {headers: {
            //     Key: res.data.data.key,
            //         Sign: MD5("GET" + "/books" + res.data.data.secret).toString()
            // }}).then(res => {
            //     console.log(res)
            // })
        })
    };

    return (
        <div className="d-flex justify-content-center align-items-center" style={{height: '100vh'}}>
            <div>
                <h3 className='text-center mb-4'>Register</h3>
                <Form
                    name="basic"
                    layout="vertical"
                    labelCol={{
                        span: 24,
                    }}
                    wrapperCol={{
                        span: 24,
                    }}
                    style={{
                        maxWidth: 600,
                    }}
                    initialValues={{remember: true}}
                    onFinish={onFinish}
                    onFinishFailed={onFinishFailed}
                    autoComplete="off"
                >
                    <Form.Item
                        label="Name"
                        name="name"
                        rules={[{required: true, message: 'Please input your Name!'}]}
                    >
                        <Input/>
                    </Form.Item>
                    <Form.Item
                        label="Email"
                        name="email"
                        rules={[{required: true, message: 'Please input your email!'}]}
                    >
                        <Input/>
                    </Form.Item>
                    <Form.Item
                        label="Key"
                        name="key"
                        rules={[{required: true, message: 'Please input your key!'}]}
                    >
                        <Input/>
                    </Form.Item>
                    <Form.Item
                        label="Secret"
                        name="secret"
                        rules={[{required: true, message: 'Please input your secret!'}]}
                    >
                        <Input.Password/>
                    </Form.Item>
                    <Form.Item wrapperCol={{offset: 8, span: 16}}>
                        <Button type="primary" htmlType="submit">
                            Register
                        </Button>
                    </Form.Item>
                </Form>
            </div>
        </div>
    );
}

export default Register;
