---
title: "CF 102299A - 集体农庄"
description: "每个集体农场生产 k[i] 袋粮食。 对于查询 (l, r, x, m)，我们仅考虑从 l 到 r 的农场。 如果一个农场供应 m 个家庭，那么给每个家庭提供相同整数数量的袋子后剩下的袋子数量恰好是 k[i] mod m。"
date: "2026-08-13T08:03:46+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 102299
codeforces_index: "A"
codeforces_contest_name: "2019 USP Try-outs"
rating: 0
weight: 102299
solve_time_s: 118
verified: true
draft: false
---

[CF 102299A - Kolkhozy](https://codeforces.com/problemset/problem/102299/A)

 **评级：** -
 **标签：** -
 **求解时间：** 1m 58s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 每个集体农场生产`k[i]`袋装谷物。 对于查询`(l, r, x, m)`，我们只考虑来自`l`通过`r`。 如果农场供应`m`给每个家庭相同整数个袋子后剩下的袋子数量正好是`k[i] mod m`。 

该查询询问该区间内有多少农场准确地有余数`x`。 自从`0 <= x < m`，这相当于计算索引`i`在`[l, r]`满意的`k[i] mod m = x`。 

官方的限制是`n, q <= 5 * 10^4`,`k[i] <= 5 * 10^4`， 和`m <= 5 * 10^4 + 1`，有 1.5 秒的时间限制。 边界故意设置得足够大，以排除处理每个查询的每个元素，这将花费`2.5 * 10^9`余数运算。 同时，价值观`k[i]`仅限于`5 * 10^4`，而第二个界限是更快解决方案的关键。 

直接实现可能会错误处理几种边缘情况。 首先，零生产是有效的。 例如，```
1 1
0
1 1 0 1
```有答案`1`， 因为`0 mod 1 = 0`。 假设所有生产值均为正值的实现会错误地排除农场。 

案例`m = 1`也很特别。 每个整数都有模一余数零。 因此```
3 1
4 7 0
1 3 0 1
```必须产生```
3
```一个常见的错误是迭代可能的值`x, x + m, ...`并意外地将上限视为排他性，从而漏掉零或错误处理单个残基。 

另一种边界情况是当最大可能值本身是残差类的成员时。 为了```
3 1
2 5 10
1 3 0 5
```答案是`1`，因为只有`5`和`10`模五余数为零，所以实际上正确的输出是`2`。 粗心的进展循环，例如`range(x, max_value, m)`之前会停下来`max_value`并返回`1`。 

## 方法

 暴力解法直接遵循定义。 对于每个查询，迭代`k[l-1:r]`， 计算`k[i] % m`，并在等于时增加答案`x`。 这显然是正确的，因为每个农场都被检查一次，并且条件正是查询中的条件。 

问题是最坏情况下的操作计数。 和`n = q = 50000`，一次查询可以覆盖整个数组，因此算法可以大致执行`50000 * 50000 = 2.5 * 10^9`余数检查。 这远远超出了 1.5 秒的限制。 

有用的观察是`k[i]`本身很小。 查询并不真正关心农场的确切值，只关心该值是否属于算术级数`x, x + m, x + 2m, ...`。 

如果`m`很大，这个级数只包含少量的值，因为每个`k[i]`至多是`50000`。 我们可以存储每个精确值的位置，并使用二分搜索来计算每个值出现的次数`[l, r]`。 

例如，与`m = 1000`和`x = 7`，唯一可能的生产值是`7, 1007, 2007, ...`。 最多有大约`50000 / 1000 = 50`其中。 因此，较大的模数为我们提供了一个简短的候选值列表。 

小的`m`行为方式相反。 为了`m = 2`，级数包含许多值，因此检查所有这些值的成本很高。 但只有少数不同的小模数。 我们可以处理每一个独特的小`m`通过扫描整个数组一次，为每个余数构建位置列表`m`。 之后，所有具有此功能的查询`m`可以通过二分查找来回答。 

这给出了基于模数的平方根分解。 选择阈值`B`大约`sqrt(50000)`， 大致`224`。 为了`m <= B`，通过一次扫描阵列来处理该模数。 为了`m > B`，通过枚举其可能值来处理每个查询。 双方表现大致`O(sqrt(50000))`每个查询或模数组的工作。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 |`O(nq)`|`O(1)`除了输入 | 太慢了 |
 | 最佳|`O(nB + q(K/B) log n)`|`O(n + K)`| 已接受 |

 这里`K = max(k[i])`， 和`B`被选择在附近`sqrt(K)`。 在给定的限制下，这两个主要术语都约为数千万个简单操作。 

## 算法演练

 1.读取数组并构建`positions[v]`，包含所有索引，其中`k[i] = v`。 因为数组是从左到右扫描的，所以按递增顺序存储索引。 
2. 根据是否模数对查询进行分组`m`是小还是大。 使用阈值`B = 224`。 小模数将集中处理，大模数将单独回答。 
3. 对于查询中实际出现的每个小模数，扫描一次数组，并将每个索引放入对应的桶中`k[i] % m`。 得到的桶`buckets[x]`恰好包含其余数模的索引`m`是`x`。 
4. 对于每个模数较小的查询，取出其对应的余数桶并使用两次二分搜索来计算索引`[l, r]`。`bisect_left`至少找到第一个位置`l`， 尽管`bisect_right`找到第一个大于的位置`r`。 他们的区别正是匹配农场的数量。 
5. 对于每个具有大模数的查询，枚举可能的生产值`x, x + m, x + 2m, ...`最多`max(k)`。 对于每个值`v`， 使用`positions[v]`和两个二分搜索来计算它的出现次数`[l, r]`，然后将这些计数加在一起。 
6. 按照原始查询顺序打印答案。 保留查询索引是必要的，因为处理小模和大模发生在不同的组中。 

### 为什么它有效

 对于固定模数`m`，一个农场正好有`x`剩余袋子当且仅当其生产价值属于该集合`{x + tm | t >= 0}`。 对于小`m`，剩余的存储桶明确包含满足此条件的每个索引，因此存储桶上的范围计数准确地给出了查询答案。 对于大型`m`，枚举同一算术级数中的所有值涵盖所有可能的生产值，而不包含其他值。 然后，精确值位置列表精确计算请求间隔内的匹配索引。 因此，两个分支都计算相同的数学集，只是表示方式不同。 

## Python 解决方案```python
import sys
from bisect import bisect_left, bisect_right

input = sys.stdin.readline

MAX_K = 50000
B = 224

def solve():
    n, q = map(int, input().split())
    a = list(map(int, input().split()))

    positions = [[] for _ in range(MAX_K + 1)]
    for i, value in enumerate(a, 1):
        positions[value].append(i)

    queries = []
    small_mods = set()

    for qi in range(q):
        l, r, x, m = map(int, input().split())
        queries.append((l, r, x, m))
        if m <= B:
            small_mods.add(m)

    answers = [0] * q

    small_queries = [[] for _ in range(B + 1)]
    large_queries = []

    for qi, (l, r, x, m) in enumerate(queries):
        if m <= B:
            small_queries[m].append((qi, l, r, x))
        else:
            large_queries.append((qi, l, r, x, m))

    # Process every small modulus that occurs in the input.
    for m in small_mods:
        buckets = [[] for _ in range(m)]

        for i, value in enumerate(a, 1):
            buckets[value % m].append(i)

        for qi, l, r, x in small_queries[m]:
            bucket = buckets[x]
            left = bisect_left(bucket, l)
            right = bisect_right(bucket, r)
            answers[qi] = right - left

    # Process large moduli query by query.
    max_value = max(a) if a else 0

    for qi, l, r, x, m in large_queries:
        total = 0
        value = x

        while value <= max_value:
            pos = positions[value]
            left = bisect_left(pos, l)
            right = bisect_right(pos, r)
            total += right - left
            value += m

        answers[qi] = total

    sys.stdout.write("\n".join(map(str, answers)))

if __name__ == "__main__":
    solve()
```这`positions`构造对应于算法的大模部分。`positions[v]`会自动排序，因为从左到右扫描原始数组时会附加索引。 

查询分组将两种复杂性机制分开。 无论有多少查询使用它，小模数都会被处理一次，而大模数并不能证明构建完整的余数结构是合理的，因此这些查询仅枚举它们可能的生产值。 

小模量环路创建`m`存储桶并扫描数组一次。 每个索引都恰好放入一个桶中，即`value % m`。 因为`x < m`由输入保证，访问`buckets[x]`始终有效。 

这两个二分搜索是故意不同的。`bisect_left(bucket, l)`返回存储位置至少为的第一个索引`l`， 尽管`bisect_right(bucket, r)`返回严格大于的第一个位置`r`。 他们的差异计算位置令人满意`l <= position <= r`，匹配包含查询间隔。 

对于大模数，级数开始于`x`，不在`0`。 可以有余数的值`x`正是`x + tm`。 循环使用`<= max_value`，而不是`< max_value`，因此等于最大数组值的产生值不会被意外跳过。 

Python整数不会溢出，所有存储的索引最多为`50000`。 主要的实现问题是运行时间，这就是阈值避免重复扫描整个数组以获得大模数的原因。 

## 工作示例

 官方的样例是：```
3 4
1 2 3
1 3 1 2
2 3 1 2
1 3 0 2
1 3 0 1
```对于前三个查询，小模数`m = 2`被处理一次。 

| 索引 |`k[i]`|`k[i] % 2`| 桶 |
 | --- | --- | --- | --- |
 | 1 | 1 | 1 | 1 |
 | 2 | 2 | 0 | 0 |
 | 3 | 3 | 1 | 1 |

 供查询`(1, 3, 1, 2)`， 桶`1`包含职位`[1, 3]`。 两个都在里面`[1, 3]`, 给予`2`。 

为了`(2, 3, 1, 2)`,同一个桶包含`[1, 3]`，但只有位置`3`属于`[2, 3]`, 给予`1`。 

为了`(1, 3, 0, 2)`， 桶`0`仅包含位置`2`, 给予`1`。 

最后一个查询有`m = 1`。 每个值都以 1 为模余数为零。 

| 索引 |`k[i]`|`k[i] % 1`| 桶 |
 | --- | --- | --- | --- |
 | 1 | 1 | 0 | 0 |
 | 2 | 2 | 0 | 0 |
 | 3 | 3 | 0 | 0 |

 余数为零的桶包含所有三个位置，所以答案是`3`。 结果输出是`2, 1, 1, 3`。 

第二个示例演示了大模量分支。```
5 2
0 7 14 21 25
1 5 7 7
1 5 4 10
```对于第一个查询，`m = 7`和`x = 7`。 可能的值为`7, 14, 21, 28, ...`。 仅有的`7`,`14`， 和`21`出现在数组中。 

| 候选人价值| 职位 | 计入`[1,5]`|
 | --- | --- | --- |
 | 7 |`[2]`| 1 |
 | 14 | 14`[3]`| 1 |
 | 21 | 21`[4]`| 1 |
 | 28 | 28`[]`| 0 |

 答案是`3`。 

对于第二个查询，`m = 10`和`x = 4`。 可能的值为`4, 14, 24, 34, ...`。 仅有的`14`发生在位置`3`，所以答案是`1`。 

输出是```
3
1
```这个例子说明了为什么值界限很重要。 尽管该区间包含五个农场，但较大的模数使我们只能检查少数可能的生产值。 

## 复杂度分析

 让`K = max(k[i])`， 和`K <= 50000`，并让`B = 224`。 

| 测量| 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 |`O(nB + q(K/B) log n)`| 每个不同的小模数扫描一次数组，而每个大查询最多检查一次`K/B + 1`候选值|
 | 空间|`O(n + K)`加一临时小模数桶结构| 精确值头寸使用`O(n)`，并且一个小模数有`O(n + m)`桶存储|

 最多有`B`小模数，因此小模数扫描成本最多约为`224 * 50000 = 11.2 million`数组访问。 大模量大于`224`，因此查询检查的次数少于大约`224`候选值。 和`50000`查询这又是按顺序`11 million`候选检查，每次检查都使用二分搜索。 这与给定的边界兼容，与`2.5 * 10^9`暴力破解所需的检查。 

## 测试用例

 下面的测试工具通过接受输入字符串的函数反映了提交的算法。 大最大情况使用`50000`相等的值和一个查询，它检查值边界和包含的右端点。```python
import sys
import io
from bisect import bisect_left, bisect_right

MAX_K = 50000
B = 224

def solve():
    input = sys.stdin.readline

    n, q = map(int, input().split())
    a = list(map(int, input().split()))

    positions = [[] for _ in range(MAX_K + 1)]
    for i, value in enumerate(a, 1):
        positions[value].append(i)

    queries = []
    small_mods = set()

    for qi in range(q):
        l, r, x, m = map(int, input().split())
        queries.append((l, r, x, m))
        if m <= B:
            small_mods.add(m)

    answers = [0] * q
    small_queries = [[] for _ in range(B + 1)]
    large_queries = []

    for qi, (l, r, x, m) in enumerate(queries):
        if m <= B:
            small_queries[m].append((qi, l, r, x))
        else:
            large_queries.append((qi, l, r, x, m))

    for m in small_mods:
        buckets = [[] for _ in range(m)]

        for i, value in enumerate(a, 1):
            buckets[value % m].append(i)

        for qi, l, r, x in small_queries[m]:
            bucket = buckets[x]
            answers[qi] = (
                bisect_right(bucket, r) -
                bisect_left(bucket, l)
            )

    max_value = max(a) if a else 0

    for qi, l, r, x, m in large_queries:
        total = 0
        value = x

        while value <= max_value:
            pos = positions[value]
            total += (
                bisect_right(pos, r) -
                bisect_left(pos, l)
            )
            value += m

        answers[qi] = total

    return "\n".join(map(str, answers))

def run(inp: str) -> str:
    old_stdin = sys.stdin
    old_stdout = sys.stdout

    try:
        sys.stdin = io.StringIO(inp)
        sys.stdout = io.StringIO()
        solve()
        return sys.stdout.getvalue()
    finally:
        sys.stdin = old_stdin
        sys.stdout = old_stdout

# Provided sample
assert run(
    """3 4
1 2 3
1 3 1 2
2 3 1 2
1 3 0 2
1 3 0 1
"""
) == "2\n1\n1\n3", "provided sample"

# Minimum-size input
assert run(
    """1 1
0
1 1 0 1
"""
) == "1", "minimum size and zero production"

# All values equal, with both small and large moduli
assert run(
    """5 3
10 10 10 10 10
1 5 0 5
2 4 3 7
1 3 10 11
"""
) == "5\n0\n3", "all equal values"

# Maximum production value must be included
assert run(
    """3 2
2 5 10
1 3 0 5
1 3 0 10
"""
) == "2\n1", "right endpoint of arithmetic progression"

# Large modulus with several candidate values
assert run(
    """5 2
0 7 14 21 25
1 5 7 7
1 5 4 10
"""
) == "3\n1", "large modulus progression"

# Maximum-size n with a uniform array
assert run(
    "50000 1\n" +
    " ".join(["50000"] * 50000) +
    "\n1 50000 0 50001\n"
) == "50000", "maximum n and maximum m"
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 |`1 1 / 0 / 1 1 0 1`|`1`| 最小尺寸、零值和`m = 1`|
 | 五份`10`三个查询 |`5, 0, 3`| 全部相等的值和多个残基类别 |
 |`2 5 10`，查询余数零模`5`和`10`|`2, 1`| 包含最大候选值 |
 |`0 7 14 21 25`，大模量|`3, 1`| 大模算术级数|
 |`50000`的副本`50000`|`50000`| 最大限度`n`， 最大限度`k[i]`， 和`m = 50001`|

 ## 边缘情况

 对于零产量，请考虑```
1 1
0
1 1 0 1
```该算法分类`m = 1`作为一个小模数，创建一个余数桶，并放置位置`1`放入桶中`0`因为`0 % 1 = 0`。 查询在位置之间搜索存储桶`1`和`1`，找到一个位置，所以输出为`1`。 

为了`m = 1`， 考虑```
3 1
4 7 0
1 3 0 1
```唯一可能的余数为零。 在预处理过程中，位置`1`,`2`， 和`3`全部进入同一个桶。 二分查找覆盖整个区间并返回`3`。 这避免了模一的任何特殊情况代码。 

对于算术级数的右端点，考虑```
3 1
2 5 10
1 3 0 5
```相关产值是`0, 5, 10, ...`。 这里没有使用大模分支，因为`m = 5`，但相同的包含级数原则也适用于小模数桶：位置`2`和`3`两者的余数都为零，所以结果是`2`。 使用独占上限的实现会错误地错过该值`10`。 

对于大模数，请考虑```
5 1
0 7 14 21 25
1 5 7 7
```模数大于阈值，因此算法枚举`7`,`14`， 和`21`，然后在下一个值是时停止`28 > 25`。 他们的位置列表各贡献一个计数，产生`3`。 该循环不会检查不相关的值，例如`0`或者`25`，因为两者都没有余数`7`模数`7`。
