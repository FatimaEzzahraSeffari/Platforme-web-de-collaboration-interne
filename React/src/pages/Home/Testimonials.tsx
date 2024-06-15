import React from 'react';
import '../../App.css';

interface TestimonialCardProps {
    quote: string;
    name: string;
    title: string;
    avatar: string;
}

const TestimonialCard: React.FC<TestimonialCardProps> = ({ quote, name, title, avatar }) => (
    <div id="testimonials">
        <div className="testimonial-card">
            <p className="testimonial-quote">"{quote}"</p>
            <div className="testimonial-author">
                <img className="testimonial-avatar" src={avatar} alt={`${name} avatar`} />
                <div>
                    <p className="testimonial-name">{name}</p>
                    <p className="testimonial-title">{title}</p>
                </div>
            </div>
        </div>
    </div>
);

const Testimonials: React.FC = () => (
    <div className="testimonials-container">
        <h2>What our users are saying</h2>
        <div className="testimonials-cards">
            <TestimonialCard
                quote="Facilitate constant collaboration with your team, ensuring no interruptions, regardless of location or time."
                name="seffari"
                title="Medical assistant"
                avatar="../images/img4.png"
            />
            <TestimonialCard
                quote="Great software that allows you to chat from any place at any time without any interruption."
                name="Fatima ezzahra"
                title="Software engineer"
                avatar="../images/img3.png"
            />
        </div>
    </div>
);

export default Testimonials;
