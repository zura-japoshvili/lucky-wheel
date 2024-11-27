import { Request, Response, NextFunction } from 'express';

const responseInterceptor = (req: Request, res: Response, next: NextFunction) => {
	const originalJson = res.json;

	// Override the json function
	res.json = function (body) {
		// Check if response status is 2xx (success) or not
		const success = res.statusCode >= 200 && res.statusCode < 300;
		const updatedResponse = {
			success,
			statusCode: res.statusCode,
			data: success ? { ...body } : undefined, // Include data only if success
			message: success ? undefined : (body.message)  || 'An error occurred', // Set error message if not success
		};

		// Call the original JSON response method
		return originalJson.call(this, updatedResponse);
	};

	next();
};
export default responseInterceptor;
