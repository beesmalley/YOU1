import React, { useState, useEffect } from 'react';
import { useParams, useLocation, useHistory } from 'react-router-dom';
import './login.css';

function JudgeForm() {
    const { posterId } = useParams(); //retrieve poster ID from URL
    const location = useLocation();
    const history = useHistory();
    const onReviewSubmit = location.state?.onReviewSubmit;

    //define questions for judges in array form
    const questions = [
      "Question 1: How clear is the poster's objective?",
      "Question 2: How innovative is the research presented?",
      "Question 3: How well are the results presented?",
      "Question 4: How impactful is the research?",
      "Question 5: How well does the poster engage the audience?"
    ];
  
    //state to store poster data and form responses
    const [posterData, setPosterData] = useState(null);
    const [responses, setResponses] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null); // State for error handling

    useEffect(() => {
        //async function to fetch poster data
        const fetchPosterData = async () => {
            try {
                setLoading(true);
                const response = await fetch(`php/poster-info.php?posterId=${posterId}`);
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                setPosterData(data);
            } catch (error) {
                console.error('Error fetching poster data:', error);
                setError(error);
            } finally {
                setLoading(false);
            }
        };

        fetchPosterData();
    }, [posterId]);

    const handleRadioChange = (questionId, value) => {
        setResponses({
            ...responses,
            [questionId]: value
        });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const response = await fetch('php/submit-responses.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(responses)
            });
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            if (onReviewSubmit) {
                onReviewSubmit(posterId);
            }
            console.log('Responses submitted successfully');
            //redirect back to the dashboard
            history.push('/userDashboard');
        } catch (error) {
            console.error('Error submitting responses:', error);
        }
    };

    //function to handle the back button click
    const handleBack = () => {
      history.goBack(); // Go back to the previous page
    };

    return (
        <div className="judge-form-container">
            <div className="judge-form">
                <button className="back-button" onClick={handleBack}>Back</button>
                    {loading && <p>Loading...</p>}
                    {error && <p>Error: {error.message}</p>}
                    {posterData && (
                        <>
                            <h1>{posterData.title}</h1>
                            <img src={posterData.imageUrl} alt={posterData.title} />
                            <form onSubmit={handleSubmit}>
                            {questions.map((question, index) => (
                                <div key={index}>
                                    <label>{question}</label>
                                    {[1, 2, 3, 4, 5].map(value => (
                                        <label key={value}>
                                            <input
                                                type="radio"
                                                name={`question-${index}`}
                                                value={value}
                                                onChange={() => handleRadioChange(`question-${index}`, value)}
                                                checked={responses[`question-${index}`] === value}
                                            />
                                            {value}
                                        </label>
                                    ))}
                                </div>
                            ))}
                            <button type="submit">Submit</button>
                        </form>
                        </>
                    )}
            </div>
        </div>
    );
}

export default JudgeForm;
