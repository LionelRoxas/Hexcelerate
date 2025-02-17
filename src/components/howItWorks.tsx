/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { Col, Row } from "react-bootstrap";
import { BsArrowLeftRight } from "react-icons/bs";

const HowItWorks: React.FC = () => {
  const [isCompanyView, setIsCompanyView] = useState(true);

  const content = {
    company: {
      heading: "Find Your Next Star Employee with AI-Powered Matching!",
      subheading:
        "Fast, Smart, and Flexible! Choose between hiring gold standard talent directly or having us manage your project with UH Manoa's top talent...",
      steps: [
        { number: 1, text: "EXPLORE CANDIDATE MATCHES", link: "Waitlist" },
        { number: 2, text: "CHOOSE MANAGEMENT STYLE", link: "Waitlist" },
        { number: 3, text: "GET STARTED WITH TOP TALENT", link: "Waitlist" },
      ],
    },
    candidate: {
      heading: "Fast-Track Your Career With AI-Powered Job Matching!",
      subheading:
        "Connect your LinkedIn profile to get matched with companies for direct hire, or join our elite development team for managed projects...",
      steps: [
        { number: 1, text: "CONNECT YOUR LINKEDIN", link: "Waitlist" },
        {
          number: 2,
          text: "GET MATCHED WITH COMPANIES",
          link: "Waitlist",
        },
        { number: 3, text: "START INSTANT AI INTERVIEWS", link: "Waitlist" },
      ],
    },
  };

  useEffect(() => {
    const boxes = document.querySelectorAll(".AnimatedBox");

    const observer = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            (entry.target as HTMLElement).style.opacity = "1";
            (entry.target as HTMLElement).style.transform = "translateY(0)";
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.5,
        rootMargin: "0px 0px -100px 0px",
      }
    );

    boxes.forEach((box) => {
      observer.observe(box);
    });

    return () => {
      boxes.forEach((box) => observer.unobserve(box));
    };
  }, []);

  const currentContent = isCompanyView ? content.company : content.candidate;

  return (
    <div className="HowItWorksDiv px-5 pt-5" style={{ overflow: "hidden" }}>
      <div id="HowItWorks" className="how-it-works-section">
        <div className="d-flex flex-column align-items-center justify-content-center">
          <h1
            className="text-center custom-h1 AnimatedBox"
            style={{
              marginTop: "20px",
              opacity: 0,
              transform: "translateY(20px)",
              transition: "all 0.5s ease",
            }}
          >
            HOW IT WORKS FOR {isCompanyView ? "YOUR COMPANY" : "CANDIDATES"}
          </h1>
          <button
            onClick={() => setIsCompanyView(!isCompanyView)}
            className="btn btn-primary gradient-button px-4 py-2 mb-4"
            style={{
              marginTop: "20px",
              marginBottom: "80px",
              borderRadius: "20px",
              transition: "all 0.3s ease",
            }}
          >
            <BsArrowLeftRight size={12} />
          </button>
        </div>

        <Row className="d-flex align-items-center">
          <Col xs={10} md={4} className="d-flex justify-content-start ps-md-5">
            <div
              className="AnimatedBox"
              style={{
                opacity: 0,
                transform: "translateY(20px)",
                transition: "all 0.5s ease 0.2s",
              }}
            >
              <h1 className="custom-heading mb-3">{currentContent.heading}</h1>
              <h5 className="custom-h4 mb-5 mt-5">
                {currentContent.subheading}
              </h5>
            </div>
          </Col>

          <Col xs={12} md={8} className="d-flex justify-content-end ps-md-8">
            <div
              className="HowItWorksImageWrapper p-4 text-center AnimatedBox"
              style={{
                marginBottom: "60px",
                opacity: 0,
                transform: "translateY(20px)",
                transition: "all 0.5s ease 0.4s",
              }}
            >
              <img
                className="HowItWorksVideo"
                style={{ width: "100%", height: "auto" }}
                src={isCompanyView ? "/Company.png" : "/Employee.png"}
                alt={isCompanyView ? "Employee matching" : "Company matching"}
              />
            </div>
          </Col>
        </Row>
      </div>
      <Row className="d-flex justify-content-center align-items-center mt-3 pb-5">
        {currentContent.steps.map((step, index) => (
          <Col
            key={index}
            xs={12}
            md={3}
            className="StepBox d-flex justify-content-center mb-5 ms-5 me-5"
          >
            {step.number === 2 ? (
              <Link
                href={step.link}
                style={{
                  textDecoration: "none",
                  color: "inherit",
                  display: "block",
                  width: "100%",
                  height: "100%",
                }}
              >
                <div
                  className="AnimatedBox mt-4"
                  style={{
                    opacity: 0,
                    transform: "translateY(20px)",
                    transition: `opacity 0.5s ease ${
                      0.6 + index * 0.2
                    }s, transform 0.5s ease ${0.6 + index * 0.2}s`,
                  }}
                >
                  <div className="StepNumber">{step.number}</div>
                  <p className="StepText">{step.text}</p>
                </div>
              </Link>
            ) : (
              <a
                href={step.link}
                style={{
                  textDecoration: "none",
                  color: "inherit",
                  display: "block",
                  width: "100%",
                  height: "100%",
                }}
              >
                <div
                  className="AnimatedBox mt-4"
                  style={{
                    opacity: 0,
                    transform: "translateY(20px)",
                    transition: `opacity 0.5s ease ${
                      0.6 + index * 0.2
                    }s, transform 0.5s ease ${0.6 + index * 0.2}s`,
                  }}
                >
                  <div className="StepNumber">{step.number}</div>
                  <p className="StepText">{step.text}</p>
                </div>
              </a>
            )}
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default HowItWorks;
