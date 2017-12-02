import React, { Component } from 'react';
import { connect } from 'react-redux';
import Rodal from 'rodal';
import 'rodal/lib/rodal.css';
import { showModal, hideModal } from '../actions';

class Modal extends Component {
  constructor(props) {
    super(props);

    this.hideModal = this.hideModal.bind(this);
    this.toggleModalOpenClass = this.toggleModalOpenClass.bind(this);

    // const jsxTEst = <div><h1>Header</h1><p>Paragraph</p></div>;
    // this.props.showModal(jsxTEst);
  }

  componentDidMount() {
    this.toggleModalOpenClass();
  }

  componentDidUpdate(prevProps, prevState) {
    // If the modal is open, add a class on the html element to hide the scroll bar
    if (prevProps.modal.visible !== this.props.modal.visible) {
      this.toggleModalOpenClass();
    }
  }

  toggleModalOpenClass() {
    if (this.props.modal.visible) {
      document.documentElement.classList.add('modal-open');
    } else {
      document.documentElement.classList.remove('modal-open');
    }
  }

  hideModal() {
    // Go back one page in the history
    this.props.history.goBack();

    // Set the redux visible state to false
    this.props.hideModal();
  }

  render() {
    return (
      <Rodal
        visible={this.props.modal.visible}
        onClose={this.hideModal}
        customStyles={{
          padding: '20px',
          overflow: 'auto',
          width: 'auto',
          height: 'auto',
        }}
      >
        <div>{this.props.modal.content}</div>
      </Rodal>
    );
  }
}

const mapStateToProps = state => ({
  modal: state.modal,
});

export default connect(mapStateToProps, {
  showModal, hideModal,
})(Modal);
