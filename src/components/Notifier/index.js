// componente para la notificacion de conexion de la PWA

import React, {Component} from "react";
import "./Notifier.css";
import classnames from "classnames";

class Notifier extends Component {
  render() {
    const notifyClass = classnames('notify', {
      danger: this.props.offline
    });
    const mensaje = this.props.offline ? "¡DESCONECTADO! ¡Cam está fuera de línea! Sus imágenes se guardarán de vez en cuando y luego se cargarán en su Biblioteca de medios en la nube una vez que su conexión a Internet esté respaldada. "
    :
    'éxito Tome una fotografía y se cargará en su cámara.';
    return (
      <div className={notifyClass}>
        <p>
          <em>{mensaje}</em>
        </p>
      </div>
    );
  }
}

export default Notifier;