import { useEffect, useState } from "react";
import { useContext } from "react";

import { AuthContext } from "../context/AuthContext";

import {
  getWorkerProfile,
  updateWorkerProfile,
  uploadPhoto,
  uploadCertification,
  getRating,
} from "../api/workerProfile";

import "../styles/WorkerProfilePage.css";

export default function WorkerProfilePage() {

  const { user } = useContext(AuthContext);

  const [profile, setProfile] = useState(null);

  const [rating, setRating] = useState(0);

  const [message, setMessage] = useState("");

  useEffect(() => {

    loadProfile();

  }, []);

  const loadProfile = async () => {

    try {

      const data = await getWorkerProfile(
        user.worker_profile_id
      );

      setProfile(data);

      const rate = await getRating(
        user.worker_profile_id
      );

      setRating(rate.rating);

    } catch (err) {

      console.log(err);

    }

  };

  const save = async () => {

    try {

      await updateWorkerProfile(
        profile.id,
        profile
      );

      setMessage("Profile updated successfully.");

    } catch {

      setMessage("Unable to save profile.");

    }

  };

  const photoChanged = async (e) => {

    await uploadPhoto(
      e.target.files[0]
    );

    loadProfile();

  };

  const certificationChanged = async (e) => {

    await uploadCertification(
      e.target.files[0]
    );

    loadProfile();

  };

  if (!profile) {

    return <h2>Loading...</h2>;

  }

  return (

    <div className="worker-profile">

      <div className="profile-card">

        <h1>Worker Profile</h1>

        {message && (

          <div className="success">

            {message}

          </div>

        )}

        <div className="profile-header">

          <img
            src={profile.photo_url}
            alt=""
            className="profile-photo"
          />

          <div>

            <h2>

              {user.first_name} {user.last_name}

            </h2>

            <p>

              ⭐ {rating}

            </p>

          </div>

        </div>

        <label>Bio</label>

        <textarea
          value={profile.bio || ""}
          onChange={(e)=>
            setProfile({
              ...profile,
              bio:e.target.value
            })
          }
        />

        <label>Skill</label>

        <input
          value={profile.skill || ""}
          onChange={(e)=>
            setProfile({
              ...profile,
              skill:e.target.value
            })
          }
        />

        <label>Experience</label>

        <input
          value={profile.experience || ""}
          onChange={(e)=>
            setProfile({
              ...profile,
              experience:e.target.value
            })
          }
        />

        <label>Location</label>

        <input
          value={profile.location || ""}
          onChange={(e)=>
            setProfile({
              ...profile,
              location:e.target.value
            })
          }
        />

        <label>Upload Profile Photo</label>

        <input
          type="file"
          onChange={photoChanged}
        />

        <label>Upload Certificate</label>

        <input
          type="file"
          onChange={certificationChanged}
        />

        <button
          className="save-btn"
          onClick={save}
        >

          Save Changes

        </button>

      </div>

    </div>

  );

}