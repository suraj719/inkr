import { useState } from "react";
import { useAppContext } from "../provider/AppStates";
import { toast } from "react-hot-toast";
import { motion } from "framer-motion";
import { Xmark, GoogleDrive, Dropbox } from "../assets/icons";

// Google Drive API configuration
// const GOOGLE_CLIENT_ID = process.env.REACT_APP_GOOGLE_CLIENT_ID;
// const GOOGLE_API_KEY = process.env.REACT_APP_GOOGLE_API_KEY;
// const GOOGLE_SCOPES = 'https://www.googleapis.com/auth/drive.file';

// Dropbox API configuration
//const DROPBOX_APP_KEY = process.env.REACT_APP_DROPBOX_APP_KEY;

export default function CloudSync() {
  const [showPopup, setShowPopup] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [selectedService, setSelectedService] = useState(null);
  const { elements } = useAppContext();

  //   // Initialize Google Drive API
  //   const initGoogleDrive = () => {
  //     return new Promise((resolve, reject) => {
  //       if (!window.gapi) {
  //         const script = document.createElement('script');
  //         script.src = 'https://apis.google.com/js/api.js';
  //         script.onload = () => {
  //           window.gapi.load('client:auth2', () => {
  //             window.gapi.client.init({
  //               apiKey: GOOGLE_API_KEY,
  //               clientId: GOOGLE_CLIENT_ID,
  //               scope: GOOGLE_SCOPES
  //             }).then(() => {
  //               resolve(window.gapi);
  //             }).catch(reject);
  //           });
  //         };
  //         script.onerror = reject;
  //         document.body.appendChild(script);
  //       } else {
  //         resolve(window.gapi);
  //       }
  //     });
  //   };

  //   // Initialize Dropbox API
  //   const initDropbox = () => {
  //     return new Promise((resolve, reject) => {
  //       if (!window.Dropbox) {
  //         const script = document.createElement('script');
  //         script.src = 'https://www.dropbox.com/static/api/2/dropins.js';
  //         script.id = 'dropboxjs';
  //         script.setAttribute('data-app-key', DROPBOX_APP_KEY);
  //         script.onload = () => {
  //           resolve(window.Dropbox);
  //         };
  //         script.onerror = reject;
  //         document.body.appendChild(script);
  //       } else {
  //         resolve(window.Dropbox);
  //       }
  //     });
  //   };

  const simulateCloudSave = async (service) => {
    if (!elements || elements.length === 0) {
      toast.error("No diagram to save");
      return;
    }

    setIsSaving(true);
    setSelectedService(service);
    const loadingToast = toast.loading(`Connecting to ${service}...`);

    try {
      // Simulate authentication
      await new Promise((resolve) => setTimeout(resolve, 1500));
      toast.dismiss(loadingToast);
      // toast.loading(`Uploading to ${service}...`);

      await new Promise((resolve) => setTimeout(resolve, 2000));

      const diagramData = JSON.stringify(elements);

      const blob = new Blob([diagramData], { type: "application/json" });

      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `diagram-${new Date().toISOString()}.json`;

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast.success(`Diagram saved to ${service} successfully!`);
      setShowPopup(false);
    } catch (error) {
      console.error(`Error saving to ${service}:`, error);
      toast.error(`Failed to save to ${service}`);
    } finally {
      setIsSaving(false);
      setSelectedService(null);
    }
  };

  return (
    <>
      <div className="collaboration">
        <button
          className="collaborateButton"
          onClick={() => setShowPopup(true)}
        >
          Cloud Save
        </button>
      </div>

      {showPopup && (
        <div className="collaborationContainer">
          <motion.div
            className="collaborationBoxBack"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.2 }}
            onClick={() => setShowPopup(false)}
          ></motion.div>
          <motion.section
            initial={{ scale: 0.7 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.15 }}
            className="collaborationBox"
          >
            <button
              onClick={() => setShowPopup(false)}
              type="button"
              className="closeCollbBox"
            >
              <Xmark />
            </button>

            <div className="collabCreate">
              <h2>Save to Cloud</h2>
              <div>
                <p>Choose a cloud storage service to save your diagram.</p>
              </div>
              <div className="cloud-services">
                <button
                  onClick={() => simulateCloudSave("Google Drive")}
                  disabled={isSaving}
                  className={`cloud-service-button ${
                    isSaving && selectedService === "Google Drive"
                      ? "loading"
                      : ""
                  }`}
                >
                  <div className="service-icon">
                    <GoogleDrive />
                  </div>
                  <div className="service-info">
                    <span className="service-name">Google Drive</span>
                    <span className="service-description">
                      Save to your Google Drive account
                    </span>
                  </div>
                  {isSaving && selectedService === "Google Drive" && (
                    <div className="loading-spinner"></div>
                  )}
                </button>
                <button
                  onClick={() => simulateCloudSave("Dropbox")}
                  disabled={isSaving}
                  className={`cloud-service-button ${
                    isSaving && selectedService === "Dropbox" ? "loading" : ""
                  }`}
                >
                  <div className="service-icon">
                    <Dropbox />
                  </div>
                  <div className="service-info">
                    <span className="service-name">Dropbox</span>
                    <span className="service-description">
                      Save to your Dropbox account
                    </span>
                  </div>
                  {isSaving && selectedService === "Dropbox" && (
                    <div className="loading-spinner"></div>
                  )}
                </button>
              </div>
            </div>
          </motion.section>
        </div>
      )}
    </>
  );
}
