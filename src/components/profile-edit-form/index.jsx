import { Backdrop, Button, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, Grid, InputLabel, MenuItem, Select, Slide, Snackbar, TextField } from "@material-ui/core";
import { Alert } from "@material-ui/lab";
import { useState, forwardRef, useEffect } from 'react';
import axios from "../../config/axios.config";
import useStyles from "../../styles/components/blood-bank-form";

const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const PostEditForm = props => {
  const classes = useStyles();
  const [form, handleForm] = useState({});
  const [errors, handleErrors] = useState({});
  const [response, handleResponse] = useState({
    loading: false,
    open: false
  });

  const handleChange = e => {
    handleForm(form => ({ ...form, [e.target.name]: e.target.value }))
  };

  const handleBlur = e => {
    if (e.target.value === "" || e.target.value === " ") {
      handleErrors(errors => ({ ...errors, [e.target.name]: `${e.target.name} is required.` }));
    }
    else {
      handleErrors(errors => {
        let error = { ...errors };
        delete error[e.target.name];
        return error;
      });
    }
  };

  const handleSubmit = () => {
    handleResponse(res => ({ ...res, loading: true }));
    axios.post(`/user/update/${props.id}`, form)
      .then(res => {
        handleResponse(res => ({ ...res, severity: "success", message: "Profile Updated Successfully" }));
      })
      .catch(err => {
        handleResponse(res => ({ ...res, severity: "error", message: "Failed To Update Profile" }));
      })
      .finally(() => {
        handleResponse(res => ({ ...res, open: true, loading: false }));
      });

  };

  useEffect(() => {
    if (props.open) {
      axios.get(`/account/profile/${props.id}`)
        .then(res => handleForm({ ...res.data }))
        .catch(err => console.log(err));
    }
  }, [props.open]);

  return (
    <Dialog open={props.open} onClose={props.handleClose}
      aria-labelledby="form-dialog-title"
      className={classes.root}
      TransitionComponent={Transition}
    >

      <Backdrop className={classes.backdrop} open={response.loading}>
        <CircularProgress color="inherit" />
      </Backdrop>


      <Snackbar open={response.open} autoHideDuration={6000} anchorOrigin={{ vertical: 'top', horizontal: 'right' }}>
        <Alert severity={response.severity}>
          {response.message}
        </Alert>
      </Snackbar>

      <DialogTitle id="form-dialog-title">Edit Profile</DialogTitle>

      <DialogContent>
        <Grid container spacing={1}>
          <Grid item xs={6}>
            <TextField
              variant="outlined"
              margin="normal"
              required
              id="fullname"
              name="fullname"
              label="Fullname"
              type="text"
              fullWidth
              value={form?.fullname}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.fullname !== undefined}
              helperText={errors.fullname}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              variant="outlined"
              margin="normal"
              required
              id="username"
              name="username"
              label="Username"
              type="text"
              fullWidth
              value={form?.username}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.username !== undefined}
              helperText={errors.username}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              variant="outlined"
              margin="normal"
              required
              id="email"
              name="email"
              label="Email Address"
              type="email"
              fullWidth
              value={form?.email}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.email !== undefined}
              helperText={errors.email}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              variant="outlined"
              margin="normal"
              required
              id="mobile"
              name="mobile"
              label="Mobile"
              type="tel"
              fullWidth
              value={form?.mobile}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.mobile !== undefined}
              helperText={errors.mobile}
            />
          </Grid>
          <Grid item xs={6}>
            <FormControl variant="outlined" fullWidth className={classes.formControl}>
              <InputLabel id="blood-type">Blood Type</InputLabel>
              <Select
                labelId="blood-type"
                 id="blood-type-select"
                // id="bloodType"
                label="Blood Type"
                //name="type"
                name="bloodType"
                value={form?.type}
                onChange={handleChange}
                onBlur={handleBlur}
                error={errors?.type}
              >
                <MenuItem value=" ">
                  <em>None</em>
                </MenuItem>
                {
                  ["O", "A", "B", "AB"].map((type, idx) => (
                    <MenuItem value={type} key={idx}>{type}</MenuItem>
                  ))
                }
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={6}>
            <FormControl variant="outlined" fullWidth className={classes.formControl}>
              <InputLabel id="antigen-type">Antigen Type</InputLabel>
              <Select
                labelId="antigen-type"
                id="antigen-type-select"
                label="Antigen Type"
                name="antigen"
                value={form?.antigen}
                onChange={handleChange}
                onBlur={handleBlur}
                error={errors?.antigen}
              >
                <MenuItem value=" ">
                  <em>None</em>
                </MenuItem>
                {
                  ["POSITIVE", "NEGATIVE"].map((type, idx) => (
                    <MenuItem value={type} key={type}>{type}</MenuItem>
                  ))
                }
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button
          type="submit"
          variant="contained"
          color="secondary"
          onClick={handleSubmit}
        >
          Save
        </Button>
        <Button onClick={() => {
          props.handleClose();
          handleResponse({
            loading: false,
            open: false
          });

        }} color="primary">
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default PostEditForm;
