// src/components/UI/ErrorBoundary.jsx
import React from 'react';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true };
    }

    componentDidCatch(error, info) {
        console.error('Ошибка:', error, info);
    }

    render() {
        if (this.state.hasError) {
            return <h2>Что-то пошло не так.</h2>;
        }

        return this.props.children;
    }
} 

export default ErrorBoundary;
