import React, { useEffect, useState } from "react";
import { Form, Button, Input, Message } from 'semantic-ui-react'
import Layout from "../../components/Layout";
import bitRound from "../../ethereum/bitRound";
import web3 from "../../ethereum/web3";
import { Router } from "../../routes";
import { create } from 'ipfs-http-client';

const projectId = '2PnF9ZfmKuZsPRcqDZqVEruXLz0';
const projectSecret = '07e8439d94e266c0b186c0fc7158ca47';
const auth =
'Basic ' + Buffer.from(projectId + ':' + projectSecret).toString('base64')

const client = create({ 
    host: 'ipfs.infura.io', 
    port: 5001, 
    protocol: 'https',
    headers: {
        authorization: auth
  } });

const EditNew = ({address}) => {
    const [description, setDescription] = useState('');
    const [images, setImages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [html, setHtml] = useState(<div/>);

    const onSubmit = async (event) => {
        event.preventDefault();
        const campaign = bitRound(address);

        setLoading(true);
        setErrorMessage('');

        try {
            const accounts = await web3.eth.getAccounts();
            const added = await client.add(description);
            console.log('Added file:', added.path);

            let CIDs = {images: [], description: added.path};
            for await (const result of client.addAll(images)) {
                CIDs.images.push(result.path);
            }
            const jsonStr = JSON.stringify(CIDs);
            const jsonBuffer = Buffer.from(jsonStr);
            const res = await client.add(jsonBuffer);
            console.log('Added file:', res.path);

            await campaign.methods
                .setInfo(res.path)
                .send({
                    from: accounts[0]
                });

            Router.pushRoute(`/bitRound/${address}`)
        } catch (err) {
            setErrorMessage(err.message);
        }

        setLoading(false);
    }

    const handleFileChange = async (e) => {
        const files = Array.from(e.target.files);
        setImages(prev => [...prev, ...files]);
    };
    
    const renderImages = images.map((image, index) => (
        <img src={image.url} key={index} />
    ));

    useEffect(() => {
        const renderImages = images.map((image, index) => (
            <img src={'/'+image.name} key={index} style={{ maxHeight: '50px', height: 'auto' }} />
        ));
        console.log(images)
        setHtml(renderImages)
    }, [images]);

    return (
        <Layout>
            <h1>Add description and images about your BitRound:</h1>
            <Form onSubmit={onSubmit} error={!!errorMessage}>
                <Form.TextArea label='Description' placeholder='Tell us more about your BitRound...' 
                    rows={10} cols={60}
                    value={description}
                    onChange={event => setDescription(event.target.value)}
                />
                <Form.Field>
                    <label>Upload Images</label>
                </Form.Field>
                <Form.Field>
                    <div className="ui fluid icon input">
                        <Input type="file" accept="image/*" multiple onChange={handleFileChange} rows={10} cols={60}/>
                    </div>
                </Form.Field>
                <div style={{display: 'flex', flexDirection: 'row', marginBottom: '1rem'}}>
                    {html}
                </div>
                <Message error header="Ooops!" content={errorMessage} />
                <Button loading={loading} primary>Create!</Button>
                
            </Form>
        </Layout>
    );
}

EditNew.getInitialProps = async (context) => {
    const { address } = context.query;
    return { address };
};

export default EditNew;
