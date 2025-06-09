
import { history } from 'umi';

export const useNavbar = () => {
	const handleLogout = () => {
		localStorage.removeItem('access_token');
		history.push('/user/login');
	};

	return {
		handleLogout,
	};
};
