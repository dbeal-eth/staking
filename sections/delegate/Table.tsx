import { FC, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { truncateAddress } from 'utils/formatters/string';
import { CellProps } from 'react-table';
import Delegates from 'containers/Delegates';
import { Account, ENTITY_ATTRS } from 'queries/delegate/types';
import Table from 'components/Table';
import useMediaQuery from 'hooks/useMediaQuery';
import { ExternalLink } from 'styles/common';
import { Svg } from 'react-optimized-image';
import WalletIcon from 'assets/svg/app/wallet-yellow.svg';
import ToggleDelegateApproval from './ToggleDelegateApproval';

const RightCol: FC = () => {
	const { t } = useTranslation();

	const { isLoading, accounts } = Delegates.useContainer();
	const isSM = useMediaQuery('sm');

	const columns = useMemo(
		() => [
			{
				Header: <>{t('delegate.list.cols.address')}</>,
				accessor: 'delegate',
				width: isSM ? 70 : 100,
				sortable: true,
				Cell: (cellProps: CellProps<Account>) => {
					const delegateAddress = cellProps.value;
					return truncateAddress(delegateAddress, isSM ? 4 : 5, isSM ? 2 : 3);
				},
			},
			...Array.from(ENTITY_ATTRS.entries()).map(([action, attr]) => ({
				Header: <>{t(`delegate.list.cols.${attr}`)}</>,
				accessor: attr,
				width: isSM ? 40 : 50,
				sortable: true,
				Cell: (cellProps: CellProps<Account>) => {
					return (
						<ToggleDelegateApproval
							account={cellProps.row.original}
							action={action}
							value={cellProps.value}
						/>
					);
				},
			})),
		],
		[t, isSM]
	);

	const noResultsMessage =
		!isLoading && accounts.length === 0 ? (
			<ListTableEmptyMessage>
				<Svg src={WalletIcon} />
				{t('delegate.list.empty')}
			</ListTableEmptyMessage>
		) : null;

	return (
		<Root data-testid="table">
			<Container>
				<ContainerHeader>
					<Title>{t('delegate.info.title')}</Title>
					<Subtitle>
						{t('delegate.info.subtitle')}{' '}
						<ExternalLink href="https://sips.synthetix.io/sips/sip-14">
							{t('delegate.info.learn-more')}
						</ExternalLink>
					</Subtitle>
				</ContainerHeader>
			</Container>

			<Container>
				<ContainerHeader>
					<ListTitle>{t('delegate.list.title')}</ListTitle>

					<ListTable
						palette="primary"
						{...{ isLoading, columns }}
						data={accounts}
						noResultsMessage={noResultsMessage}
						showPagination={true}
					/>
				</ContainerHeader>
			</Container>
		</Root>
	);
};

export default RightCol;

//

export const Root = styled.div`
	& > div {
		margin-bottom: 32px;
	}

	a,
	a:visited {
		color: ${(props) => props.theme.colors.blue};
		text-decoration: none;
	}
`;

export const Container = styled.div`
	background: ${(props) => props.theme.colors.navy};
`;

export const ContainerHeader = styled.div`
	padding: 16px;
`;

export const Title = styled.div`
	font-family: ${(props) => props.theme.fonts.extended};
	color: ${(props) => props.theme.colors.white};
	font-size: 14px;
`;
export const Subtitle = styled.div`
	font-family: ${(props) => props.theme.fonts.regular};
	color: ${(props) => props.theme.colors.gray};
	font-size: 14px;
	margin-top: 12px;
`;

const ListTable = styled(Table)`
	.table-row,
	.table-body-row {
		& > :last-child {
			justify-content: flex-end;
		}
	}

	.table-body {
		min-height: 300px;
	}

	.table-header-cell,
	.table-body-cell {
		padding: 0;
	}
`;

const ListTitle = styled(Title)`
	text-transform: uppercase;
`;

const ListTableEmptyMessage = styled.div`
	font-size: 12px;
	padding: 20px 0 0;
	display: flex;
	flex-direction: column;
	justify-items: space-around;
	align-items: center;
	color: white;

	svg {
		margin-bottom: 10px;
	}
`;
