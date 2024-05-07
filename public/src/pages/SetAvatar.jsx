import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import loader from "../../src/assets/loader.gif";
import { AvatarContainer } from "../styles/AvatarContainer";
import { ToastContainer, toast } from "react-toastify";
import axios from "axios";
import { Buffer } from "buffer";
import { setAvatarRoute } from "../utils/APIRoutes";
import "react-toastify/dist/ReactToastify.css";

export default function SetAvatar() {
  const toastOptions = {
    position: "bottom-right",
    autoClose: 8000,
    pauseOnHover: true,
    draggable: true,
    theme: "dark",
  };
  const [avatars, setAvatars] = useState([]);
  const [isLoading, setLoading] = useState(true);
  const [selectedAvatar, setSelectedAvatar] = useState(undefined);

  // const api = "https://api.multiavatar.com/3423423423?apiKey=sqPFgvUweONhTl";
  const api = "https://api.multiavatar.com";

  const navigate = useNavigate();

  const setProfilePicture = async () => {
    if (selectedAvatar === undefined) {
      toast.error("Please select an avatar first", toastOptions);
    } else {
      const user = await JSON.parse(localStorage.getItem("user"));
      const { data } = await axios.post(`${setAvatarRoute}/${user._id}`, {
        avatarImage: avatars[selectedAvatar],
      });
      if (data.isSet) {
        user.isAvatarImageSet = true;
        user.avatarImage = data.image;
        localStorage.setItem("user", JSON.stringify(user));
        navigate("/");
      } else {
        toast.error("Error setting avatar. Please try again", toastOptions);
      }
    }
  };
  useEffect(() => {
    let user = JSON.parse(localStorage.getItem("user"));
    if (localStorage.getItem("token") && user.isAvatarImageSet) {
      navigate("/");
    }else if(!localStorage.getItem("token") ){
      navigate("/login");
    }
  }, []);
  useEffect(() => {
    const fetchData = async () => {
      const data = [];
      const apiKey = "sqPFgvUweONhTl"; // Replace YOUR_API_KEY with your actual API key
      const getRandomId = () => Math.floor(Math.random() * 1000000000); // Generate a random ID

      for (let i = 0; i < 4; i++) {
        const id = getRandomId();
        const url = `${api}/${id}?apiKey=sqPFgvUweONhTl`;
        try {
          const response = await axios.get(url, {
            responseType: "arraybuffer",
          });
          const buffer = Buffer.from(response.data, "binary").toString(
            "base64"
          );
          data.push(buffer);
        } catch (error) {
          console.error("Error fetching avatar:", error);
        }
      }

      setAvatars(data);
      setLoading(false);
    };

    fetchData();
  }, []);

  return (
    <>
      {isLoading ? (
        <AvatarContainer>
          <img src={loader} alt="loader" className="loader" />
        </AvatarContainer>
      ) : (
        <AvatarContainer>
          <div className="title-container">
            <h1>Pick an avatar as your profile picture</h1>
          </div>

          <div className="avatars">
            {avatars.map((avatar, index) => {
              return (
                <div
                  key={index}
                  className={`avatar  ${
                    selectedAvatar === index ? "selected" : ""
                  }`}
                >
                  <img
                    src={`data:image/svg+xml;base64,${avatar}`}
                    alt="avatar"
                    onClick={() => {
                      setSelectedAvatar(index);
                    }}
                  />
                </div>
              );
            })}
          </div>
          <button className="submit-btn" onClick={setProfilePicture}>
            Set as profile picture
          </button>
        </AvatarContainer>
      )}
      <ToastContainer />
    </>
  );
}
