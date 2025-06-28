import { Button } from "antd";
import cx from "clsx";
import { ChevronDown, ChevronRight, LoaderIcon } from "lucide-react";
import { AnimatePresence, m } from "motion/react";
import type React from "react";
import { useState } from "react";

export interface TreeNode {
	key: string;
	title: string;
	parentId: string | null;
	children?: Array<TreeNode>;
}

export interface TreeNodeWithData<TData> extends TreeNode {
	data?: TData; // 可以存储额外的数据
}

export interface TreeProps {
	treeData?: Array<TreeNode>;

	className?: string;
	/**
	 * 异步加载数据
	 * @returns
	 */
	onLoadData?: (node: TreeNode) => Promise<void>;

	/**
	 * 点击节点触发
	 * @returns
	 */
	onSelect?: (node: TreeNode) => void;

	/**
	 * 展开/收缩时触发
	 * @param node
	 * @param expanded
	 * @returns
	 */
	onExpand?: (node: TreeNode, expanded: boolean) => void;

	/**
	 * (受控)选中的key
	 */
	selectedKey?: string;

	/**
	 * （受控）展开的key集合
	 */
	expandedKeys?: Set<string>;

	renderMoreMenu?: (node: TreeNode, selected: boolean) => React.ReactNode;
}

export interface TreeNodeProps {
	current: TreeNode;

	level: number;

	/**
	 * 异步加载数据
	 * @returns
	 */
	onLoadData?: (node: TreeNode) => Promise<void>;

	/**
	 * 点击节点触发
	 * @returns
	 */
	onSelect?: (node: TreeNode) => void;

	/**
	 * 展开/收缩时触发
	 * @param node
	 * @param expanded
	 * @returns
	 */
	onExpand?: (node: TreeNode, expanded: boolean) => void;

	/**
	 * (受控)选中的key
	 */
	selectedKey?: string;

	/**
	 * （受控）展开的key集合
	 */
	expandedKeys?: Set<string>;

	renderMoreMenu?: (node: TreeNode, selected: boolean) => React.ReactNode;
}

const TreeNodeItem = ({ current, level, expandedKeys, selectedKey, renderMoreMenu, onExpand, onLoadData, onSelect }: TreeNodeProps) => {
	const [isLoading, setLoading] = useState(false);

	const onItemClick = (node: TreeNode) => {
		if (selectedKey === node.key) return;

		onSelect?.(node);
	};

	const onItemExpand = async (event: React.MouseEvent<HTMLElement, MouseEvent>, node: TreeNode) => {
		event.stopPropagation();
		setLoading(true);
		try {
			const expanded = !(expandedKeys?.has(node.key) ?? false);
			if (onLoadData && expanded) {
				await onLoadData(node);
			}

			onExpand?.(node, expanded);
		} finally {
			setLoading(false);
		}
	};

	const currentExpanded = expandedKeys?.has(current.key) ?? false;
	const currentSeleted = !!selectedKey && selectedKey === current.key;

	return (
		<>
			<div
				aria-selected={currentSeleted}
				className={cx(
					"h-[38px] flex items-center hover:bg-gray-100 px-1 rounded cursor-pointer mb-1 transition-colors group",
					"aria-selected:bg-primary/90 aria-selected:text-white",
				)}
				title={current.title}
			>
				<div className="flex-1 flex items-center h-full" onClick={() => onItemClick(current)}>
					{level > 1 && <span style={{ width: `${(level - 1) * 16}px` }} />}

					<Button
						type="text"
						size="small"
						style={{ color: "unset", padding: "0px 4px", marginRight: "4px" }}
						onClick={async (e) => await onItemExpand(e, current)}
					>
						{isLoading ? (
							<LoaderIcon className="w-4 h-4 animate-spin" />
						) : currentExpanded ? (
							<ChevronDown className="w-4 h-4" />
						) : (
							<ChevronRight className="w-4 h-4" />
						)}
					</Button>

					<span className="flex-1 truncate ... text-sm font-medium">{current.title} </span>
				</div>
				{renderMoreMenu?.(current, currentSeleted)}
			</div>

			<AnimatePresence initial={false}>
				{currentExpanded && (
					<m.div
						key={current.key}
						initial="collapsed"
						animate="open"
						exit="collapsed"
						variants={{
							open: { maskImage: "linear-gradient(to bottom, black 100%, transparent 100%)", height: "auto" },
							collapsed: { maskImage: "linear-gradient(to bottom, black 50%, transparent 100%)", height: 0 },
						}}
						transition={{ duration: 0.1 }}
					>
						{(current.children?.length ?? 0) > 0 &&
							current.children?.map((node) => (
								<m.div
									key={node.key}
									initial="closed"
									animate="open"
									exit="closed"
									variants={{
										open: { filter: "blur(0px)", opacity: 1 },
										closed: { filter: "blur(2px)", opacity: 0 },
									}}
								>
									<TreeNodeItem
										current={node}
										level={level + 1}
										expandedKeys={expandedKeys}
										selectedKey={selectedKey}
										onExpand={onExpand}
										onLoadData={onLoadData}
										onSelect={onSelect}
										renderMoreMenu={renderMoreMenu}
									/>
								</m.div>
							))}
					</m.div>
				)}
			</AnimatePresence>
		</>
	);
};

const Tree: React.FC<TreeProps> = (props) => {
	const { treeData, className } = props;

	return (
		<div className={cx("relative", className)}>
			<div>
				{treeData?.map((node) => (
					<TreeNodeItem key={node.key} {...props} current={node} level={1} />
				))}
			</div>
		</div>
	);
};

export default Tree;
