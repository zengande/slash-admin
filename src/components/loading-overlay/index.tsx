import { LoaderIcon } from "lucide-react";

interface LoadingOverlayProps {
	visible?: boolean;
}

const LoadingOverlay = ({ visible = false }: LoadingOverlayProps) => {
	if (!visible) return undefined;

	return (
		<div className="w-full h-full absolute top-0 left-0 z-99 bg-white/10 backdrop-blur-xs">
			<div className="w-full h-full flex items-center justify-center">
				<LoaderIcon className="animate-spin size-6" />
			</div>
		</div>
	);
};

export default LoadingOverlay;
