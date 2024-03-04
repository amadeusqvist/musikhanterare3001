import { mainMenu } from './menu';
const readline = require('readline');

jest.mock('readline', () => ({
    createInterface: jest.fn(() => ({
        question: jest.fn()
    }))
}));

describe('Main Menu', () => {
    let consoleLogMock: jest.SpyInstance;

    beforeEach(() => {
        consoleLogMock = jest.spyOn(console, 'log').mockImplementation();
    });

    afterEach(() => {
        consoleLogMock.mockRestore();
    });

    it('displays options correctly', () => {
        mainMenu();
        expect(consoleLogMock).toHaveBeenCalledWith('[1] Choose Playlist');
        expect(consoleLogMock).toHaveBeenCalledWith('[2] Make Playlist');
        expect(consoleLogMock).toHaveBeenCalledWith('[3] Import Spotify playlist');
    });

    it('handles invalid input choices', () => {
        // Mock readline interface
        const mockInterface = {
            question: jest.fn()
        };

        // Mock readline.createInterface to return the mock interface
        jest.spyOn(readline, 'createInterface').mockReturnValue(mockInterface);

        // Mock readline.question implementation
        mockInterface.question.mockImplementationOnce((question, callback) => {
            // Simulate invalid input choice
            callback('5');
        });

        // Mock console.error to check if the error message is logged
        const consoleErrorMock = jest.spyOn(console, 'error').mockImplementation(() => {});

        // Call mainMenu
        mainMenu();

        // Expect console.error to be called with the appropriate error message
        expect(consoleErrorMock).toHaveBeenCalledWith('Invalid input. Please try again.');
    });

});
