---
title: "CF 102412F - 智商测试"
description: "我们从包含 0、1 和 2 的集合开始。一个操作选择集合中已有的任意两个数字 x 和 y，并插入 x 2 −y。 插入的值必须保持在0到10 18之间，我们最多可以执行43次操作。"
date: "2026-08-11T08:28:42+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 102412
codeforces_index: "F"
codeforces_contest_name: "MEX Foundation Contest (supported by AIM Tech)"
rating: 0
weight: 102412
solve_time_s: 93
verified: true
draft: false
---

[CF 102412F - 智商测试](https://codeforces.com/problemset/problem/102412/F)

 **评级：** -
 **标签：** -
 **求解时间：** 1m 33s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们从包含以下内容的集合开始`0`,`1`， 和`2`。 一次操作选择任意两个数字`x`和`y`已在集合中并插入

 x 2 -y。 

插入的值必须介于`0`和 10 18，我们最多可以执行`43`运营。 给定一个目标`n`，我们只需要构建它，而不是最小化操作次数。 官方声明允许在这些限制内进行任何有效的构造。 

目标可以大到 10 18，因此尝试搜索所有可能的结构是没有希望的。 有用的结构是运算中的平方。 如果我们想构造一些数字`p`，我们可以选择`x`接近 p ​，这使得两个数字都需要构造`p`显着小于`p`。 

小值`0`,`1`， 和`2`已经可用，因此必须将它们视为最终状态。 例如，如果`n = 2`，正确的输出只是空输出，因为目标已经在初始集中。 总是试图生成一个粗心的实现`n`会不必要地构造另一个值，甚至可能创建无效的递归循环。 

另一个边缘情况是完美的正方形。 为了`n = 9`，选择`x = 3`给出`y = 0`， 所以`3^2 - 0 = 9`。 正确的构造可以是```
3 0
```一个粗心的实现假设`y`必须为正将拒绝完全有效的构造，即使该语句明确允许零。 

另一种边界情况是正好低于平方的值。 例如，`n = 15`给出`x = 4`和`y = 1`，因为 4 2 −1=15。 重要的细节是`x`必须是平方根的上限，而不是下限。 使用`x = 3`会使 3 2 −15 为负值并违反输出条件。 

实际的约束对于平方根约简来说异常友好。 目标最多为 10 18，因此其平方根最多为 10 9。反复求平方根会极快地降低幅度，仅在少数级别后就达到很小的值。 官方限制为 1 秒和 256 MiB，最多允许 43 次操作。 

## 方法

 暴力方法会尝试探索每次操作后可能到达的集合。 给定当前集合，它可以选择每个有序对`(x, y)`, 计算`x²-y`，并递归地探索结果状态。 这是正确的，因为每个法律解释都是由此类选择的某种序列表示的。 

问题在于选择的数量。 即使从初始集合来看，也有 3 2 =9 个有序对。 如果我们天真地对每对进行 43 次操作分支，那么可能的选择序列的数量就已经是

 9 43 ≈10 41 。 

一旦集合包含更多值，实际分支就会变得更大。 跟踪整个集合也会创建一个巨大的状态空间，因此暴力破解是不切实际的。 

关键的观察是反转最终的操作。 假设我们想要构建`p`。 我们需要一些已经可以建造的`x`和`y`满意的

 x 2 -y=p。 

选择

 x=⌈ p ​ ⌉,y=x 2 −p。 

那么方程就自动满足。 有趣的部分是两个新目标的大小。 自从`x`是 x 2 ≥p 的最小整数，我们有

 (x−1) 2 <p≤x 2 。 

因此

 0≤y=x 2 -p<x 2 -(x-1) 2 =2x-1。 

所以`x`是关于 p ​，并且`y`最多大约 2 p ​。 而不是构建一个数量的大小`p`，我们递归地构造两个数字，其大小大致为`p`。 

对于 p≤10 18，第一个`x`最多为 10 9，并且`y`最多约为 2⋅10 9。下一个递归级别下降到大约 10 5，然后是几百，然后是几十，最后是初始值`0`,`1`， 和`2`。 最终的构造轻松地保持在所需的 43 次操作以下。 

该构造本质上是分而治之，但分割是基于平方根而不是一半。 我们首先递归地构造依赖关系，然后打印创建当前数字的操作。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 蛮力 | 至少 O(9 43 ) 构造分支 | 指数| 太慢了|
 | 最佳 | O(Klogn)，其中 K≤43 | O(K) | 已接受 |

 ## 算法演练

 1. 初始化一组已经可用的数字`0`,`1`， 和`2`。 这些数字不需要任何操作，因此递归在到达其中之一时立即停止。 
2. 对于一个目标`p`尚不可用，请计算 x=⌈ p ​ ⌉。 在Python中，这可以通过以下方式精确获得`math.isqrt`，避免 10 18 附近的值出现浮点精度问题。 
3. 计算 y=x 2 −p。 根据构造，x 2 −y=p，所以一旦`x`和`y`已经构建完毕，最后一个操作创建`p`。 
4. 递归构造`x`和`y`录音前`(x, y)`。 这种排序是必需的，因为只有当两个操作数都属于该集合时，该操作才合法。 
5. 将每个构造值存储在`seen`放。 这可以防止当两个不同的递归分支需要相同的中间值时重复相同的操作。 
6. 两个依赖项都可用后，追加`(x, y)`给出答案并标记`p`建成后。 结果列表已经处于有效的执行顺序中，因为每个操作都出现在其操作数所需的操作之后。 

### 为什么它有效

 不变的是，无论何时`build(p)`完成，`p`属于构造集，并且到目前为止存储的每个操作按照其打印顺序都是合法的。 对于一个新的`p`，我们选择 x=⌈ p ​ ⌉ 和 y=x 2 −p，因此 x 2 −y=p 准确。 递归调用构造`x`和`y`首先，之后最后的操作是合法的并插入`p`。 自从`x`和`y`比`p`，递归达到`0`,`1`， 或者`2`并终止。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

from math import isqrt

def solve():
    n = int(input())

    # These numbers are present before any operation.
    seen = {0, 1, 2}
    operations = []

    def build(p):
        if p in seen:
            return

        # x is the smallest integer with x^2 >= p.
        x = isqrt(p)
        if x * x < p:
            x += 1

        y = x * x - p

        # Both operands must already exist before we can use them.
        build(x)
        build(y)

        operations.append((x, y))
        seen.add(p)

    build(n)

    out = []
    for x, y in operations:
        out.append(f"{x} {y}")

    sys.stdout.write("\n".join(out))

if __name__ == "__main__":
    solve()
```这`seen`set 准确地表示模拟构造中当前可用的数字。 开始于`0`,`1`， 和`2`匹配问题的初始状态。 

平方根的计算需要小心。 使用`int(math.sqrt(p))`作为一般整数技术是不安全的，因为浮点数不能准确表示 10 18 以内的每个整数。`isqrt`精确计算整数平方根。 如果`x*x < p`, 递增`x`给出上限平方根.

 递归调用发生在之前`operations.append((x, y))`。 反转这两行将产生无效答案，因为打印的操作可能引用尚未生成的数字。 

Python 整数具有任意精度，因此不存在溢出问题。 事实上，最大的`x`只有 10 9，而`y`尽管目标本身可能是 10 18，但其数量级仅为 10 9。 

的`seen`check 还处理共享依赖项。 如果相同的中间值出现在两个分支中，则仅生成一次，从而将操作计数安全地保持在限制内。 

## 工作示例

 对于样本 1，目标是`5`。 

| 步骤| 正在建设的目标 | x| y | 运营|
 | ---| ---| ---| ---| ---|
 | 1 |`3`|`2`|`1`| 2 2 −1=3 | 2 2 −1=3 |
 | 2 |`4`|`2`|`0`| 2 2 -0=4 | 2 2 -0=4
 | 3 |`5`|`3`|`4`| 3 2 −4=5 | 3 2 −4=5

 结果输出可以是```
2 1
2 0
3 4
```样本本身还构建了`0`第一次使用`1 1`，但该操作是不必要的，因为`0`已经在初始集合中。 由于该问题接受任何有效的构造，因此最好省略冗余操作。 

跟踪清楚地显示了依赖关系顺序。 构建`5`，我们需要`3`和`4`; 两者都是在打印最终操作之前根据初始值构造的。 

对于样本 2，目标是`7`。 

| 步骤| 正在建设的目标 | x| y | 运营|
 | ---| ---| ---| ---| ---|
 | 1 |`3`|`2`|`1`| 2 2 −1=3 | 2 2 −1=3 |
 | 2 |`7`|`3`|`2`| 3 2 −2=7 | 2

 结果输出是```
2 1
3 2
```这演示了特别短的情况，其中目标的平方根依赖关系本身可以立即构造。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 | O(克洛恩) | 最多`K <= 43`产生不同的运算，并且每个运算都使用整数平方根和集合运算 |
 | 空间| O(K) | 递归，`seen`集合和操作列表仅包含生成的中间值 |

 复杂性的重要部分不是 n 上的传统多项式界限。 递归深度很小，因为最大的依赖关系约为 2 n​。 从 10 18 开始，震级大约下降到 10 9、10 5、10 2，然后是小整数。 因此，该结构非常适合 43 次操作的限制，并且在 256 MiB 限制下使用的内存可以忽略不计。 

## 测试用例

 由于输出不是唯一的，因此测试工具应验证生成的序列，而不是将其与一个固定字符串进行比较。 下面的验证器检查每个操作数是否已经可用，每个生成的值是否合法，最终生成目标，并且打印不超过 43 个操作。```python
# helper: run solution on input string, return output string
import sys
import io
from math import isqrt

def solution(inp: str) -> str:
    old_stdin = sys.stdin
    old_stdout = sys.stdout

    sys.stdin = io.StringIO(inp)
    sys.stdout = io.StringIO()

    try:
        n = int(sys.stdin.readline())

        seen = {0, 1, 2}
        operations = []

        def build(p):
            if p in seen:
                return

            x = isqrt(p)
            if x * x < p:
                x += 1

            y = x * x - p

            build(x)
            build(y)

            operations.append((x, y))
            seen.add(p)

        build(n)

        sys.stdout.write(
            "\n".join(f"{x} {y}" for x, y in operations)
        )
        return sys.stdout.getvalue()
    finally:
        sys.stdin = old_stdin
        sys.stdout = old_stdout

def validate(inp: str, output: str) -> bool:
    n = int(inp.strip())

    available = {0, 1, 2}
    lines = output.strip().splitlines() if output.strip() else []

    assert len(lines) <= 43, "too many operations"

    for line in lines:
        parts = line.split()
        assert len(parts) == 2, "each operation needs x and y"

        x, y = map(int, parts)

        assert x in available, f"x={x} was not constructed"
        assert y in available, f"y={y} was not constructed"

        value = x * x - y
        assert 0 <= value <= 10**18, "generated value is out of range"

        available.add(value)

    assert n in available, f"target {n} was not constructed"
    return True

# Provided sample 1.
out = run("5\n") if False else solution("5\n")
assert validate("5\n", out), "sample 1"

# Provided sample 2.
out = solution("7\n")
assert validate("7\n", out), "sample 2"

# Minimum-size input: target already exists initially.
out = solution("0\n")
assert out == "", "zero needs no operations"

# All-equal / smallest nontrivial construction.
out = solution("4\n")
assert validate("4\n", out), "constructing a perfect square"

# Boundary case just below a square.
out = solution("15\n")
assert validate("15\n", out), "value just below 16"

# Maximum-size target.
out = solution("1000000000000000000\n")
assert validate("1000000000000000000\n", out), "maximum target"
```| 测试输入| 预期产出 | 它验证了什么 |
 | ---| ---| ---|
 |`0`| 空输出 | 初始设定边界|
 |`4`| 任何有效的构造 | 完全平方处理和零作为`y`|
 |`15`| 任何有效的构造 | 上限平方根边界 |
 |`1000000000000000000`| 任何最多具有 43 次操作的有效构造 | 最大目标和递归深度 |

 ## 边缘情况

 对于`n = 0`，算法输入`build(0)`，立即看到`0`已经在`seen`，并返回。 确切的输入是```
0
```并且正确的输出是空的。 不需要任何操作，打印不必要的操作只会使施工时间更长。 

对于完美的正方形，例如`n = 9`,`isqrt(9)`回报`3`和`3*3`已经等于`n`， 所以`y = 0`。 递归要求`3`和`0`构造`3`然后打印```
3 0
```得出 3 2 −0=9。 零是合法的操作数，因为它从一开始就存在。 

对于正下方的数字，例如`n = 15`，地板平方根是`3`，但不能使用，因为 3 2 −15 是负数。 该算法检测到`3*3 < 15`, 增量`x`到`4`，并得到`y = 1`。 最终的操作是```
4 1
```得出 16−1=15。 这正是需要上限平方根的原因。 

对于最大目标，```
1000000000000000000
```第一个选择是`x = 1000000000`和`y = 0`。 该算法只需要构造`1000000000`，之后目标由```
1000000000 0
```递归构造`1000000000`使用其平方根附近的值，并且继续进行相同的减少，直到仅保留初始值。 数量级缩小得如此之快，以至于整个依赖树仍保持在允许的 43 个操作之内。
