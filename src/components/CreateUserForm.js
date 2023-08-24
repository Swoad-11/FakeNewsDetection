import React, { useEffect, useState } from "react";
import * as Yup from "yup";
import { useFormik, Form, FormikProvider } from "formik";

import { styled } from "@mui/material/styles";
import { Card, Container, Typography, Stack, TextField } from "@mui/material";

import Button from "@mui/material/Button";

const ContentStyle = styled("div")(({ theme }) => ({
  maxWidth: 800,
  margin: "auto",
  display: "flex",
  justifyContent: "center",
  flexDirection: "column",
  padding: theme.spacing(12, 0),
}));

export default function CreateUserForm() {
  //const navigate = useNavigate();
  const [prediction, setPrediction] = useState("");

  const UserSchema = Yup.object().shape({
    review: Yup.string()
      .min(5, "Too Short!")
      .required("Sample news required"),
  });

  const formik = useFormik({
    initialValues: {
      review: "",
    },
    validationSchema: UserSchema,
    onSubmit: async (values) => {
      try {
        const response = await fetch("http://127.0.0.1:5000/api/predict", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ message: values.review }),
        });
        const data = await response.json();
        console.log("Response Data:", data);
        setPrediction(data.prediction);
      } catch (error) {
        console.error("Error predicting:", error);
      }
    },
  });
  const { errors, touched, handleSubmit, isSubmitting, getFieldProps } = formik;

  return (
    <Container>
      <ContentStyle>
        <Typography variant="h4" gutterBottom>
          Fake News Detector
        </Typography>
        <FormikProvider value={formik}>
          <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
            <Stack spacing={3}>
              <TextField
                fullWidth
                autoComplete="review"
                type="text"
                label="Please give a news for detection"
                {...getFieldProps("review")}
                error={Boolean(touched.review && errors.review)}
                helperText={touched.review && errors.review}
              />
              <Button
                fullWidth
                size="large"
                type="submit"
                variant="contained"
                color="success"
                loading={isSubmitting}
              >
                Submit
              </Button>
              {prediction && (
                <Typography variant="body1" color="text.secondary">
                  Prediction: {prediction}
                </Typography>
              )}
            </Stack>
          </Form>
        </FormikProvider>
      </ContentStyle>
    </Container>
  );
}
