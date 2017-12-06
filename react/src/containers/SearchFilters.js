import React, { Component } from 'react';
import { Field, reduxForm } from 'redux-form';
import { map as _map } from 'lodash';
import { connect } from 'react-redux';
import { SEARCH_FILTERS_FORM_FIELDS } from '../config/form/formFields';

class SearchFilters extends Component {
  constructor(props) {
    super(props);
    this.onSubmit = this.onSubmit.bind(this);
    this.renderField = this.renderField.bind(this);
    this.renderAlert = this.renderAlert.bind(this);
    this.onChangeField = this.onChangeField.bind(this);
    this.onBlurField = this.onBlurField.bind(this);

    this.state = {
      isAlertVisible: false,
    };
  }

  onBlurField(event, newValue, previousValue) {
    if (event.currentTarget.nodeName === 'INPUT') {
      this.props.handleSubmit(this.onSubmit)();
    }
  }

  onChangeField(event, newValue, previousValue) {
    if (event.currentTarget.nodeName !== 'INPUT') {
      // handleSubmit() submits the values as they currently are in the props, and the props don't get updated from Redux until the next process tick (https://github.com/erikras/redux-form/issues/883#issuecomment-216022940)
      // Therefore we need to dispatch an action to update the value in redux
      // After that we submit the form, which then knows that the form has been changed

      // console.log(this.props.change('SearchFiltersForm', event.target.name, event.target.value));

      // https://github.com/erikras/redux-form/issues/369#issuecomment-278758539
      this.props.dispatch(this.props.change('SearchFiltersForm', event.target.name, event.target.value));

      // The setTimeout is a sort of hack so we wait for a split second for the dispatch action to the store to occur first and the onSubmit method knows the form has been changed
      // https://github.com/erikras/redux-form/issues/537#issuecomment-309751480
      setTimeout(this.props.handleSubmit(this.onSubmit));
    }
  }

  /**
   * If the form values have changed since the last time this method was ran, then set the new form values in the store
   * When a form field loses focus or the form is submitted, this method is ran
   * @param  {object} values All of the form fields that are filled out (automatically sent from redux-form)
   * @return void
   */
  onSubmit(values) {
    // Check if the form values have changed since the last submit
    // The dirty boolean (signifies if the form has changed from its initial values) is established by redux-form by comparing the currently entered values to the initial form values
    // After we identify the form as having been changed, we will send the new form values to replace the original initial form values so redux-form is always comparing the current form values against the last submitted form values
    if (this.props.dirty) {
      // Set the initial values for the form on the redux store (This is used by redux form to compare the current values to the initial values so we can determine if there are new values since the last submit)
      this.props.initialize(values);

      // If the alert box is not already active, make it active for a specified amount of time
      if (!this.state.isAlertVisible) {
        this.setState({
          isAlertVisible: true,
        });

        setTimeout(() => {
          this.setState({
            isAlertVisible: false,
          });
        }, 2500);
      }
    }
  }

  buildOptions(options) {
    return options.map(option => <option key={option.value} value={option.value}>{option.text}</option>);
  }

  buildFieldElement(field) {
    switch (field.type) {
      case 'input':
        return (
          <input
            id={field.id}
            className="uk-input"
            type="text"
            placeholder={field.placeholder}
            {...field.input}
          />
        );
      case 'select':
        return (
          <select
            id={field.id}
            className="uk-select"
            {...field.input}
          >
            {this.buildOptions(field.options)}
          </select>
        );
      default:
        return null;
    }
  }

  renderAlert() {
    const visibilityClass = this.state.isAlertVisible ? 'alert-visible' : '';
    const messageTypeClass = 'uk-alert-success';
    return (
      <div id="search-confirmation-message" className={`uk-fixed-alert uk-alert ${visibilityClass} ${messageTypeClass}`} data-uk-alert>
        <a className="uk-alert-close" data-uk-close />
        <p>Your filters have been updated.</p>
      </div>
    );
  }

  renderField(field) {
    const { meta: { touched, error } } = field;
    const formControlsClassName = field.addOn ? 'uk-form-controls uk-form-group' : 'uk-form-controls';

    return (
      <div className={field.containerClassName}>
        <label className="uk-form-label" htmlFor={field.input.name}>
          {field.label} {field.labelSecondary && <small className="uk-text-muted">(sq ft)</small>}
        </label>
        <div className={formControlsClassName}>
          {field.addOn &&
            <div className="uk-input-group-addon">{field.addOn}</div>
          }
          {this.buildFieldElement(field)}
        </div>
      </div>
    );
  }

  render() {
    const {
      handleSubmit, pristine, submitting, invalid,
    } = this.props;

    return (
      <div id="search-panel" className="mobile-panel">
        <div id="search-panel-container" className="uk-padding-small">
          {this.renderAlert()}
          <div className="uk-heading-divider uk-flex uk-flex-top uk-margin-bottom">
            <h3 className="uk-flex-1 uk-margin-remove-bottom">Filter Search </h3>
            <button className="uk-hidden uk-button uk-button-primary uk-button-small clear-search-parameters-btn">Clear Filters</button>
          </div>
          <div id="search-box" className="uk-padding-small uk-card uk-card-default uk-box-shadow-small uk-remove-margin-top@m">
            <form
              ref={(form) => { this.form = form; }}
              onSubmit={handleSubmit(this.onSubmit)}
              id="properties-search-form"
              className="uk-grid-small uk-form-stacked"
              data-uk-grid
            >
              {_map(SEARCH_FILTERS_FORM_FIELDS, ({
                containerClassName, fieldClassName, type, label, labelSecondary = false, placeholder = false, options, addOn = false, apiName = false,
              }, fieldName) => (
                <Field
                  component={this.renderField}
                  key={fieldName}
                  type={type}
                  containerClassName={containerClassName}
                  fieldClassName={fieldClassName}
                  label={label}
                  labelSecondary={labelSecondary}
                  name={apiName || fieldName}
                  id={fieldName}
                  placeholder={placeholder}
                  options={options}
                  addOn={addOn}
                  onChange={this.onChangeField}
                  onBlur={this.onBlurField}
                />
              ))}
              <div className="uk-width-expand@s uk-width-1-6@m">
                <button
                  type="submit"
                  className="uk-button uk-button-primary uk-width-1-1"
                  id="search-box-search-btn"
                  disabled={submitting || pristine || invalid}
                >Search
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }
}

const validate = (values) => {
  const errors = {};

  // console.log('values in validate()', values);

  // Check for required fields
  // _each(SEARCH_FILTERS_FORM_FIELDS, (fieldObject, fieldName) => {
  //   // Check if the FIELDS config object has a custom validation function to run
  //   if (fieldObject.validation) {
  //     fieldObject.validation(values, errors);
  //   }
  //
  //   // If the field is required as per the config object, check if the field is filled out
  //   if (fieldObject.required && !values[fieldName]) {
  //     errors[fieldName] = `Enter ${fieldName}`;
  //   }
  // });

  // If errors is empty, the form is fine to submit
  // If errors has any properties, redux form assumes form is invalid
  return errors;
};

/**
 * mapStateToProps which gives the component access to the redux store
 * @return {object} - Mapping of state properties (in the redux store) to prop properties that will be available within the component
 */
// const mapStateToProps = state => ({
//   SearchFiltersForm: state.form.SearchFiltersForm,
// });
const mapStateToProps = state => ({
  SearchFiltersForm: state.form.SearchFiltersForm,
});

export default reduxForm({
  validate,
  form: 'SearchFiltersForm',
  enableReinitialize: true,
  keepDirtyOnReinitialize: true,
  // initialValues: { q: 'jeff' },
})(connect(mapStateToProps)(SearchFilters));
