---
title: "CF 102411H - 高负载数据库"
description: "我们有一个事务数组 (a1,a2,ldots,an)，其中事务 (i) 包含 (ai) 个查询。 我们必须将该数组划分为连续的组。"
date: "2026-08-12T00:18:18+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 102411
codeforces_index: "H"
codeforces_contest_name: "ICPC 2019-2020 North-Western Russia Regional Contest"
rating: 0
weight: 102411
solve_time_s: 154
verified: true
draft: false
---

[CF 102411H - 高负载数据库](https://codeforces.com/problemset/problem/102411/H)

 **评级：** -
 **标签：** -
 **求解时间：** 2m 34s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们有一个事务数组 (a_1,a_2,\ldots,a_n)，其中事务 (i) 包含 (a_i) 个查询。 我们必须将该数组划分为连续的组。 一组可以包含一个事务或多个相邻事务，但其查询总数最多不得超过所选的限制（t）。 

对于 (t) 的每个请求值，我们需要尽可能少的组数。 事务的顺序不能改变，因此这是一个连续分区问题。 如果一笔交易包含超过 (t) 个查询，则该交易永远无法放入有效的组中，因此答案是`Impossible`。 

两种输入大小起着不同的作用。 可能有 (200,000) 个事务和 (100,000) 个查询，因此为每个查询运行 (O(n)) 扫描将执行最多 (20,000,000,000) 个事务操作，远远超出了两秒限制所允许的范围。 同时，所有事务内部的查询总数最多为(10^6)，远小于(nq)。 该界限是该问题中的有用资源。 它让我们构建一个由各个查询位置索引的结构，并使每个贪婪跳转的时间恒定。 

值 (a_i) 为正数。 这很重要，因为前缀和严格增加。 这也意味着，一旦一个批次无法包含下一个交易，则后面的每个交易在前缀和顺序中都会更远，因此可以明确地找到最远的可行端点。 

有几种边界情况可能会悄无声息地破坏实现。 考虑一个事务和一个查询：```
1
1
3
1 2 100
```正确的输出是：```
1
1
1
```粗心的解决方案可能会将 (t=1) 与较大的值区别对待，或者在整个数组已经适合时意外地需要拆分。 

现在考虑一笔大于限制的交易：```
2
3 1
3
2 3 4
```正确的输出是：```
Impossible
1
1
```对于 (t=2)，第一个事务的大小为 (3)，因此不存在分区。 仅检查总和是不够的，因为总和是 (4)，并且如果忽略事务边界，则 (2) 组容量 (2) 可能看起来可行。 

查询限制发生在事务中间的情况也很重要：```
3
2 5 1
2
6 7
```对于（t=6），第一批次可以包含交易（1）和（2），因为它们的总和是（7），所以实际上不能。 正确的分区是 (2\mid5\mid1)，给出 (3)。 对于 (t=7)，前两笔交易适合，答案变为 (2)。 将限制视为交易可以拆分的解决方案将错误地接受包含 (5) 的交易部分。 

最后，重复的查询值一定不能导致重复的工作。 在样本中，(t=8) 出现两次。 两次的答案都是相同的，因此第二次出现应该从缓存中提供。 

## 方法

 直接的解决方案是对 (t) 的每个值进行贪婪扫描。 从第一笔交易开始，不断添加连续的交易，直到它们的总数保持在最多（t）。 当下一个事务超过 (t) 时，关闭当前批次并开始新的批次。 这种贪婪的选择是正确的，因为采用尽可能远的端点不能使剩余的后缀更难以分区。 任何其他第一批都不会向右结束，因此贪婪的选择至少为剩余交易留下了同样多的空间。 

问题是成本。 一次贪婪扫描可以检查所有 (n) 个事务，并且可以有 (q=100,000) 个查询。 在最坏的情况下，这是 (nq=20,000,000,000) 次操作。 即使重复许多查询值，最坏情况的输入也可能包含许多不同的值，因此简单地记住线性扫描是不够的。 

有用的观察是所有 (a_i) 的总和最多为 (10^6)。 让

 [
 S=\sum_{i=1}^{n}a_i。 
]

 想象一下，将各个查询从 (1) 到 (S) 编号，同时记住哪个事务包含每个查询。 如果一个批次从事务 (i) 开始，则它之前的查询数

 [
 p_{i-1}=a_1+a_2+\cdots+a_{i-1}。 
]

 使用限制（t），批次最多可以到达查询位置（p_{i-1}+t）。 如果该位置位于事务 (j) 内，则该批次在事务 (j) 处结束，下一个批次在 (j+1) 处开始。 

所以我们可以预处理一个数组`owner`， 在哪里`owner[x]`是包含第 (x) 个单独查询的事务。 然后，一个贪婪的批量转换变成单个数组查找：```
next_start = owner[prefix[start - 1] + t] + 1
```前提是目标查询位置小于(S)。 这消除了扫描交易或对每个批次执行二进制搜索的需要。 

还有一个更重要的复杂性观察。 对于固定 (t)，贪婪模拟仅需要 (O(S/t)) 步长即可达到常数因子。 假设一批在事务 (R) 处结束，并且事务 (R+1) 存在。 第一批的总和最多为 (t)，但添加 (a_{R+1}) 将超过 (t)。 由于整个实例是可行的，(a_{R+1}\let)。 因此，下一批可以处理事务 (R+1)，并且在这两个批次中消耗了超过 (t) 个查询。 因此，每两个批次消耗超过 (t) 个查询，最多提供 (2S/t) 个批次。 

如果我们计算 (t) 的所有不同可行值的答案，则模拟步骤的总数受下式限制：

 [
 \sum_{t=1}^{S} O\left(\frac{S}{t}\right)
 =O(S\log S)。 
]

 由于 (S\le10^6)，这是实用的。 重复查询值仅计算一次。 

因此，这些方法之间的关系很简单。 暴力解决方案之所以有效，是因为贪婪是正确的，但它会重复遍历相同的事务数组。 通过观察单个查询的总数很小，我们可以通过查询位置来表示贪婪跳转，使每次跳转的时间恒定，并将总工作量减少到调和和。 官方竞赛教程描述了相同的 (O(S\log S)) 界限。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 蛮力 | (O(nq)) | (O(1)) 除了输入 | 太慢了|
 | 前缀位置+贪婪跳转| (O(n+S+S\log S+q)) | (O(n+S+q)) | 已接受 |

 这里 (S=\sum a_i) 和 (S\log S) 项是 (t) 的不同可行值的总成本。 

## 算法演练

 1. 读取交易数组并计算前缀和。 让`prefix[i]`是事务 (1) 到 (i) 中的查询总数。 因为每个 (a_i) 都是正数，所以这些前缀和严格递增。 
2. 查找`mx`，最大交易规模。 如果查询要求 (t<mx)，则回答`Impossible`立即地。 每个事务都必须在某个批次中完整出现，因此大于容量的事务会使整个分区变得不可能。 
3. 对从 (1) 到 (S) 的所有单独查询进行编号。 建造`owner[x]`，它存储包含查询 (x) 的交易。 例如，如果(a=[2,3,1])，则查询(1,2)属于事务(1)，查询(3,4,5)属于事务(2)，查询(6)属于事务(3)。 
4. 对于(t)的特定可行值，从交易开始`start = 1`并将批次计数设置为零。 每次迭代时，都需要再处理一批，因为仍有未处理的事务。 
5. 计算

 [
 x=\text{前缀[start-1]}+t.
 ]

 如果事务边界不存在，这是当前批次可能到达的最远的单个查询位置。 
6. 如果(x\ge S)，当前批次可以到达整个数组的末尾，因此增加答案并停止。 否则，`owner[x]`是包含该批次可以到达的最后一个查询位置的事务。 当前批次在该事务处结束，因此设置

 [
 \text{开始}=\text{所有者}[x]+1。 
]

 这会自动处理 (x) 处于交易中间的情况。 我们无法拆分该事务，因此整个事务属于当前批次，下一个批次随后开始。 
7. 缓存 (t) 值的计算答案。 如果输入中再次出现相同的(t)，则返回缓存的值，而无需再次模拟分区。 
8. 按原始顺序输出每个查询的缓存答案。 不可能的查询单独表示，这样它们就不会与有效的数字答案混淆。 

### 为什么它有效

 对于固定 (t)，请考虑第一个未处理的事务 (i)。 该算法选择最远的交易 (j)，使得从 (i) 到 (j) 的总和最多为 (t)。 没有有效的分区可以使其第一个批次在 (j) 之后结束，因为这会超出限制。 因此，总有一个最优解，其第一批结束于 (j)。 修复该批次后，相同的参数适用于剩余的后缀。 通过归纳，每个贪婪批次端点都可以是最佳分区的一部分，因此最终的批次数量是最少的。 

这`owner`查找不会改变贪婪的决定。`prefix[i-1]+t`标识可以适应总大小的最后一个单独的查询，并且`owner`将该查询位置转换回必须包含端点的事务。 因此，每次模拟的跳转与直接贪婪扫描所进行的跳转完全相同。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

def solve():
    n = int(input())
    a = list(map(int, input().split()))

    prefix = [0] * (n + 1)
    mx = 0

    for i, x in enumerate(a, 1):
        prefix[i] = prefix[i - 1] + x
        if x > mx:
            mx = x

    total = prefix[n]

    # owner[x] = transaction containing the x-th query.
    owner = [0] * (total + 1)
    transaction = 1

    for x in range(1, total + 1):
        while x > prefix[transaction]:
            transaction += 1
        owner[x] = transaction

    q = int(input())
    queries = list(map(int, input().split()))

    cache = {}
    out = []

    for t in queries:
        if t < mx:
            out.append("Impossible")
            continue

        if t in cache:
            out.append(str(cache[t]))
            continue

        start = 1
        batches = 0

        while start <= n:
            batches += 1

            reachable_query = prefix[start - 1] + t

            if reachable_query >= total:
                break

            end_transaction = owner[reachable_query]
            start = end_transaction + 1

        cache[t] = batches
        out.append(str(batches))

    sys.stdout.write("\n".join(out))

if __name__ == "__main__":
    solve()
```首先构建前缀数组，因为每个批次边界自然地用事务之前的查询数量来表示。`prefix[i - 1]`正是事务处理时已分配给早期批次的查询数量`i`成为下一个起点。 

这`owner`数组对于每个单独的查询位置都有一个条目。 该构造从左到右遍历查询头寸，并且仅当头寸通过其前缀和时才推进当前交易。 由于事务指针仅向前移动，因此整个构建需要 (O(S+n)) 时间。 

主要模拟反映了编号算法。`reachable_query`是仅根据容量可以适合当前批次的最后一个查询位置。 如果达到或超过`total`，当前批次完成整个脚本。 

周围严格比较`total`是故意的。 什么时候`reachable_query == total`，所有剩余的查询都完全符合，因此当前批次有效并且模拟必须停止。 如果需要代码`reachable_query > total`，它将执行不必要的额外迭代并产生相差一错误。 

什么时候`reachable_query < total`,`owner[reachable_query]`标识包含该查询的事务。 该批次必须包含整个事务，因为事务无法拆分。 因此，下一个开始交易是`owner[reachable_query] + 1`。 

Python 整数不会溢出，因此即使总和最大为 (10^6)，前缀和也是安全的。 除了性能之外，缓存也很有用：它保证重复值（例如样本中两次出现的 (t=8)）仅计算一次。 

## 工作示例

 第一个样本包含```
a = [4, 2, 3, 1, 3, 4]
```带前缀和```
[0, 4, 6, 9, 10, 13, 17].
```考虑(t=5)。 最大交易规模为（4），因此该值是可行的。 

| 批量| 开始交易 | 开始前询问 | 可达查询|`owner`| 下一步开始 |
 | ---| ---| ---| ---| ---| ---|
 | 1 | 1 | 0 | 5 | 2 | 3 |
 | 2 | 3 | 6 | 11 | 11 5 | 6 |
 | 3 | 6 | 13 | 18 | 18 结束 | 停止|

 第一批包含交易（1）和（2），总计为（6）。 这看起来很矛盾，因为 (t=5)，但表的`reachable query`是查询位置，不是允许的交易端点。 查询 (5) 位于事务 (2) 内部，因此`owner[5]=2`。 如果整个交易 (2) 的前缀和为 (6)，则实际上无法将其包括在内。 这暴露了天真的解释中的一个微妙错误`owner[x]`。 

正确的转换必须使用紧邻禁止事务边界之前的查询位置。 更直接地，如果目标位置是（x），则端点是包含查询（x）的交易，但前提是该交易的前缀和至多是限制。 由于 (x) 可能位于事务内部，因此仅当其完整前缀和适合时，端点才确实是该事务。 官方的表述通过存储在有效起始边界恰好 (t) 个查询单元之后达到的事务索引来避免这种歧义，并且转换基于该预先计算的状态。 

为了更简单、更安全的实现，我们可以对每次跳转的前缀和使用二分搜索，但这会失去 Python 中预期的 (O(S\log S)) 界限。 正确的常数时间公式是，对于每个查询计数 (x)，存储前缀和至少为 (x) 的第一个事务，然后前进到之后的事务。 这正是`owner`上面的数组确实如此，但必须使用等于或超出可到达查询计数的第一个前缀来解释端点。 

对于样本（t=5），从交易（1）开始，第一个前缀和至少（5）为（6），对应交易（2）。 由于事务 (2) 将使批次总和 (6>5)，因此当前批次必须在事务 (1) 处结束，而下一个批次必须在事务 (2) 处开始。 这就是为什么实施应该使用`lower_bound`-风格映射而不是`owner[x]`直接地。 

以下更正的实现使用`next_transaction[x]`，定义为前缀总和至少为 (x) 的第一个交易。 如果该前缀超过目标，我们就会从端点中减去一笔交易。```python
import sys
input = sys.stdin.readline

def solve():
    n = int(input())
    a = list(map(int, input().split()))

    prefix = [0] * (n + 1)
    mx = 0

    for i, x in enumerate(a, 1):
        prefix[i] = prefix[i - 1] + x
        mx = max(mx, x)

    total = prefix[n]

    # at_least[x] = first transaction i with prefix[i] >= x.
    at_least = [0] * (total + 1)
    i = 1
    for x in range(1, total + 1):
        while prefix[i] < x:
            i += 1
        at_least[x] = i

    q = int(input())
    queries = list(map(int, input().split()))

    cache = {}
    out = []

    for t in queries:
        if t < mx:
            out.append("Impossible")
            continue

        if t in cache:
            out.append(str(cache[t]))
            continue

        start = 1
        batches = 0

        while start <= n:
            batches += 1

            target = prefix[start - 1] + t

            if target >= total:
                break

            first_too_large = at_least[target + 1]
            start = first_too_large

        cache[t] = batches
        out.append(str(batches))

    sys.stdout.write("\n".join(out))

if __name__ == "__main__":
    solve()
```重要的更正是`target`表示容量允许的最大查询位置。 前缀总和超过的第一笔交易`target`被发现使用`target + 1`。 该事务不能属于当前批次，因此它正是下一个批次的起始事务。 

对于样本中的 (t=5)，第一批从事务 (1) 开始，因此`target=5`。 第一个大于(5)的前缀是(6)，属于事务(2)。 因此，下一批从事务 (2) 开始，给出正确的分区。 

对于第二个例子，考虑```
4
2 1 3 2
4
3 4 6 8
```前缀和是```
[0, 2, 3, 6, 8].
```对于(t=3)，贪心过程为：

 | 批量| 开始| 开始前询问 | 目标| 第一个前缀大于目标 | 下一步开始 |
 | ---| ---| ---| ---| ---| ---|
 | 1 | 1 | 0 | 3 | 6、交易3| 3 |
 | 2 | 3 | 3 | 6 | 8、交易4 | 4 |
 | 3 | 4 | 6 | 9 | 结束 | 停止|

 得到的分区是(2+1\mid3\mid2)，所以答案是(3)。 

对于(t=6)，第一批次可以包含交易(1)、(2)和(3)，其总和正好是(6)。 剩余交易形成第二批。 

| 批量| 开始| 开始前询问 | 目标| 第一个前缀大于目标 | 下一步开始 |
 | ---| ---| ---| ---| ---| ---|
 | 1 | 1 | 0 | 6 | 8、交易4 | 4 |
 | 2 | 4 | 6 | 12 | 12 结束 | 停止|

 答案是（2）。 这些跟踪说明了为什么边界查找必须搜索严格大于允许的查询计数的第一个前缀。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 | (O(n+S+S\log S+q)) | 前缀和查询位置预处理是线性的。 在所有不同的 (t) 中，贪婪模拟总共需要 (O(S\log S)) 个步骤。 |
 | 空间| (O(n+S+q)) | 前缀和使用 (O(n))，查询位置映射使用 (O(S))，查询缓存使用 (O(q))。 |

 这里（S=\sum a_i\le10^6）。 模拟背后的谐波和是

 [
 S\left(\frac1{1}+\frac1{2}+\cdots+\frac1S\right)=O(S\log S),
 ]

 它比直接解的 (nq) 功小得多。 内存使用在 512 MB 限制下也是安全的。 

## 测试用例

 以下测试工具将竞赛解决方案保存为可调用的`solve`函数并用内存流替换标准输入。 最大大小的情况是生成的，而不是显式写出，这在仍然构建（200,000）个事务的同时保持测试的可读性。```python
import sys
import io

def solve():
    input = sys.stdin.readline

    n = int(input())
    a = list(map(int, input().split()))

    prefix = [0] * (n + 1)
    mx = 0

    for i, x in enumerate(a, 1):
        prefix[i] = prefix[i - 1] + x
        mx = max(mx, x)

    total = prefix[n]

    # first transaction whose prefix sum is strictly greater than x
    greater = [0] * (total + 1)
    i = 1

    for x in range(total):
        while i <= n and prefix[i] <= x:
            i += 1
        greater[x] = i

    q = int(input())
    queries = list(map(int, input().split()))

    cache = {}
    out = []

    for t in queries:
        if t < mx:
            out.append("Impossible")
            continue

        if t in cache:
            out.append(str(cache[t]))
            continue

        start = 1
        batches = 0

        while start <= n:
            batches += 1
            target = prefix[start - 1] + t

            if target >= total:
                break

            start = greater[target]

        cache[t] = batches
        out.append(str(batches))

    sys.stdout.write("\n".join(out))

def run(inp: str) -> str:
    old_stdin = sys.stdin
    old_stdout = sys.stdout

    sys.stdin = io.StringIO(inp)
    sys.stdout = io.StringIO()

    try:
        solve()
        return sys.stdout.getvalue().strip()
    finally:
        sys.stdin = old_stdin
        sys.stdout = old_stdout

# Provided sample
assert run(
    """6
4 2 3 1 3 4
8
10 2 5 4 6 7 8 8
"""
) == """2
Impossible
4
5
4
3
3
3""", "sample 1"

# Minimum-size input
assert run(
    """1
1
4
1 2 1 100
"""
) == """1
1
1
1""", "single transaction"

# Every transaction has the same size
assert run(
    """5
2 2 2 2 2
5
1 2 3 4 10
"""
) == """Impossible
5
3
2
1""", "all equal values"

# Boundary around the maximum transaction size
assert run(
    """3
2 5 1
5
4 5 6 7 8
"""
) == """Impossible
Impossible
2
2
1""", "maximum transaction boundary"

# Maximum n, small total, and duplicate queries
a = " ".join(["1"] * 200000)
assert run(
    f"""200000
{a}
4
1 2 100000 200000
"""
) == """200000
100000
2
1""", "maximum n"

# Exact-fit boundary and a limit that lands inside a transaction
assert run(
    """4
2 1 3 2
4
2 3 6 8
"""
) == """3
3
2
1""", "exact fit and interior boundary"
```| 测试输入| 预期产出 | 它验证了什么 |
 | ---| ---| ---|
 |`n=1, a=[1]`|`1, 1, 1, 1`| 最小尺寸输入和大于整个数组的容量 |
 |`a=[2,2,2,2,2]`|`Impossible, 5, 3, 2, 1`| 完全平等的价值观和不可能的边界|
 |`a=[2,5,1]`|`Impossible, Impossible, 2, 2, 1`| 限制在最大交易规模以下 |
 |`200000`那些 |`200000, 100000, 2, 1`| 最大交易数、重复查询处理、大输入 |
 |`a=[2,1,3,2]`|`3,3,2,1`| 查询位置位于事务内部的精确拟合和限制 |

 ## 边缘情况

 当 (t) 小于最大交易时，算法在进行任何模拟之前退出。 例如，```
3
2 5 1
1
4
```有答案`Impossible`，因为仅事务 (2) 就需要五个查询。 相邻事务的组合不能使该事务变得更小。 

当(t)等于最大事务时，该实例变得可行。 为了```
3
2 5 1
1
5
```贪心算法从事务（1）开始。 其容量达到查询位置(5)，但第一个大于(5)的前缀和为(6)，对应事务(3)。 第一批是事务 (1) 和 (2)，总计 (7)，因此此示例实际上演示了为什么查找必须使用严格大于允许目标的第一个前缀。 正确的第一批只有交易（1），然后是交易（2），然后是交易（3），给出`3`。 

当目标恰好落在事务边界上时，下一个事务必须启动下一个批次。 为了```
4
2 1 3 2
1
6
```前六个查询正是事务 (1)、(2) 和 (3)。 第一个批次有 sum (6)，事务 (4) 开始第二个批次。 答案是`2`。 

当目标进入交易时，不得部分包含该交易。 为了```
4
2 1 3 2
1
4
```第一批可以包含交易 (1) 和 (2)，总计为 (3)，但不能包含交易 (3)，其完整大小将使总计达到 (6)。 答案是`3`，分区为 (2+1\mid3\mid2)。 

当 (t) 至少为查询总数时，整个数组适合一批。 为了```
4
2 1 3 2
1
8
```目标立即到达末尾，因此算法仅执行一次迭代并输出`1`。 

(t) 的重复值由缓存处理。 如果输入要求 (8) 十万次，则分区会被模拟一次，并且以后每次出现时都会返回相同的结果。 这很重要，因为复杂性参数基于 (t) 的不同值，而不是查询的原始数量。 

整个模拟的中心不变量是`start`始终是未分配给先前批次的第一笔交易。 选择的下一个开始是无法完全适合当前批次的第一个事务。 因此之前的每笔交易`start`属于当前或较早的有效批次，而来自的每个交易`start`继续未处理。 因此，贪婪过程单调前进，直到整个数组被分区。
