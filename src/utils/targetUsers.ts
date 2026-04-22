import { ENV } from '../config/env';
// target users
const getTargetUsers = (): string[] => {
    const users = ENV.USER_ADDRESS
        .split(',')
        .map((address) => address.trim())
        .filter(Boolean);

    return Array.from(new Set(users));
};

export default getTargetUsers;
