"""Initial migration

Revision ID: ebe218f0963d
Revises: 
Create Date: 2024-10-16 21:03:42.095199

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'ebe218f0963d'
down_revision = None
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('cart', schema=None) as batch_op:
        batch_op.drop_column('total_price')

    with op.batch_alter_table('cart_item', schema=None) as batch_op:
        batch_op.add_column(sa.Column('ingredient', sa.String(), nullable=False))
        batch_op.drop_column('price')
        batch_op.drop_column('quantity')

    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('cart_item', schema=None) as batch_op:
        batch_op.add_column(sa.Column('quantity', sa.INTEGER(), autoincrement=False, nullable=False))
        batch_op.add_column(sa.Column('price', sa.DOUBLE_PRECISION(precision=53), autoincrement=False, nullable=False))
        batch_op.drop_column('ingredient')

    with op.batch_alter_table('cart', schema=None) as batch_op:
        batch_op.add_column(sa.Column('total_price', sa.DOUBLE_PRECISION(precision=53), autoincrement=False, nullable=True))

    # ### end Alembic commands ###