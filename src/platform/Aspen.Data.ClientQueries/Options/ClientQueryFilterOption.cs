// using System.Linq.Expressions;

// namespace Aspen.Data.Database;

// public abstract class ClientQueryFilterOption
// {
//     public abstract Expression<Func<T, bool>> ToExpression<T>();
// }

// public static class ClientQueryFilterOptionExtensions
// {
//     public static IQueryable<T> ApplyTo<T>(this ClientQueryFilterOption filter, IQueryable<T> queryable)
//         => queryable.Where(filter.ToExpression<T>());
// }

// public class ComparisonClientQueryFilterOption : ClientQueryFilterOption
// {
//     public required string ColumnName { get; set; }
//     public required ComparisonOperator Operator { get; set; }
//     public required object Operand { get; set; }

//     public override Expression<Func<T, bool>> ToExpression<T>()
//     {
//         var parameter = Expression.Parameter(typeof(T), "x");
//         var property = Expression.Property(parameter, ColumnName);
//         var constant = Expression.Constant(Operand);

//         var body = Operator switch
//         {
//             ComparisonOperator.Equals => Expression.Equal(property, constant),
//             ComparisonOperator.NotEquals => Expression.NotEqual(property, constant),
//             ComparisonOperator.GreaterThan => Expression.GreaterThan(property, constant),
//             ComparisonOperator.LessThan => Expression.LessThan(property, constant),
//             _ => throw new NotSupportedException($"Filter operator {Operator} is not supported.")
//         };

//         return Expression.Lambda<Func<T, bool>>(body, parameter);
//     }
// }

// public enum ComparisonOperator
// {
//     Equals,
//     NotEquals,
//     GreaterThan,
//     LessThan
// }
