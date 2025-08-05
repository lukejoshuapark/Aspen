namespace Aspen.Data.ClientQueries;

internal sealed class ExpressionValueContainer<T>
{
    public T Value { get; }

    public ExpressionValueContainer(T value)
    {
        Value = value;
    }
}
