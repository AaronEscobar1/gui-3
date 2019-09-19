import React, { Component } from 'react';
import { Webcam } from '../../webcam';
import './camera.css';
import axios from 'axios';
import { aframe } from 'aframe';
import { aframeChrome } from 'aframe-chromakey-material';

class Camera extends Component {
  constructor() {
    super();
    this.webcam = null;
    this.state = {
      capturedImage: null,
      captured: false,
      uploading: false,
    }
  }

  componentDidMount() {
    // initialize the camera
    this.canvasElement = document.createElement('canvas');
    this.webcam = new Webcam(
        document.getElementById('webcam'),
        this.canvasElement
    );
    this.webcam.setup().catch(() => {
      alert('Error en el acceso de tu camara');
    });

    
  }

  componentDidUpdate(prevProps){
    if(!this.props.offline && (prevProps.offline === true)){
      this.batchUploads();
    }
  }

  render() {
    const imageDisplay = !this.state.captureImage ?
      <img src={this.state.capturedImage} alt="captured" width="350"/>
      :
      <spam />

    const buttons = this.state.captured ?
      <div>
        <button className="deleteButton" onClick={this.discardImage} > Delete Photo</button>
        <button className="captureButton" onClick={this.uploadImage}> Upload Photo </button>
      </div>
      :
      <button className="captureButton" onClick={this.captureImage}> Take Picture </button>

    const uploading = this.state.uploading ? 
      <div> <p> Uploading Image, plase wait... </p> </div>
      :
      <spam />

    return (
      <div>
        {uploading}
      
        <video autoPlay playsInline muted id="webcam" width="100%" height="200" />
        <br />

        <div className="imageCanvas">
          {imageDisplay}
        </div>

        {buttons}
      </div>
    )
  }

  captureImage = async () => {
    const capturedData = this.webcam.takeBase64Photo({ type: 'jpeg', quality: 0.8 });
    this.setState({
      captured: true,
      capturedImage: capturedData.base64
    });
  }

  discardImage = () => {
    this.setState({
      captured: false,
      capturedImage: null
    })
  }

  uploadImage = () => {
    if (this.props.offline) {
      console.log("estás usando en modo fuera de línea sha");
      // Creando un numero aleatorio y prefix
      const prefix = 'camara_gui';
      // creando el numero aleatorio
      const rs = Math.random().toString(36).substr(2, 5);
      localStorage.setItem(`${prefix}${rs}`, this.state.capturedImage);
      alert('Imagen guardada localmente, se subira una vez que se detecte la conexión a Internet');
      this.discardImage();
      // save image to local storage
    } else {
      this.setState({ 'uploading': true });
      axios.post(
        `https://api.api.api`,
        {
          //Credenciales
          file: this.state.capturedImage,
          upload_preset: 'RepresentanX'
        }
      ).then((data) => this.checkUploadStatus(data)).catch((error) => {
          alert('Lo sentimos, encontramos un error al subir tu imagen');
        this.setState({ 'uploading': false });
      });
    }
  }

  findLocalItems = (query) => {
    let i;
    let results = [];
    for (i in localStorage) {
      if (localStorage.hasOwnProperty(i)) {
        if (i.match(query) || (!query && typeof i === 'string')) {
          const value = localStorage.getItem(i);
          results.push({ key: i, val: value });
        }
      }
    }
    return results;
  }

  checkUploadStatus = (data) => {
    this.setState({ 'uploading': false });
    if (data.status === 200) {
      alert('Imagen subida a : api');
      this.discardImage();
    } else {
      alert('Lo siento, ha habido un error subiendo tu imagen');
    }
  }

  batchUploads = () => {
    // Aquí es donde todas las imágenes guardadas se pueden cargar como cargas por lotes
    const images = this.findLocalItems(/^cloudy_pwa_/);
    let error = false;
    if (images.length > 0) {
      this.setState({ 'uploading': true });
      for (let i = 0; i < images.length; i++) {
        // upload
        axios.post(
          `https://api.api.api.api`,
          {
            // credenciales
            file: images[i].val,
            upload_preset: 'CLOUDINARY_CLOUD_PRESET'
          }
        ).then(
          (data) => this.checkUploadStatus(data)
        ).catch((error) => {
          error = true;
        })
      }
      this.setState({ 'uploading': false });
      if (!error) {
        alert("Todas las imágenes guardadas se han cargado en su biblioteca de medios en la nube");
      }
    }
  } 
}


export default Camera;