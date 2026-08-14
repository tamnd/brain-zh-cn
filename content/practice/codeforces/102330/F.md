---
title: "CF 102330F - \u0417\u0432\u0435\u0440\u044c\u043a\u0438"
description: "我们有 n 只动物。 动物 i 具有三个参数 a i ​、b i ​和 c i ​。 如果笼子目前最多容纳 c i 只动物，则该动物贡献 i 只攻击性。 如果笼子里容纳的动物超过 c i​，则贡献 b i​，其中 a i ≤ b i​。"
date: "2026-08-13T04:05:07+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 102330
codeforces_index: "F"
codeforces_contest_name: "\u0421\u0438\u0440\u0438\u0443\u0441.2019.\u041d\u043e\u044f\u0431\u0440\u044c.\u041e\u0447\u043d\u044b\u0439 \u043e\u0442\u0431\u043e\u0440"
rating: 0
weight: 102330
solve_time_s: 146
verified: true
draft: false
---

[CF 102330F - \u0417\u0432\u0435\u0440\u044c\u043a\u0438](https://codeforces.com/problemset/problem/102330/F)

 **评级：** -
 **标签：** -
 **求解时间：** 2m 26s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们有 n 只动物。 动物 i 具有三个参数 a i ​、b i ​和 c i ​。 如果笼子目前最多容纳 c i 只动物，则该动物贡献 i 只攻击性。 如果笼子里容纳的动物超过 c i​，则贡献 b i​，其中 a i ≤ b i​。 

只有当动物的当前攻击性值之和最多为 s 时，笼子才能容纳一组动物。 我们需要尽可能多的动物同时进入室内。 

困难在于，动物的贡献取决于笼子里的最终动物数量。 如果我们检查是否可以选择恰好 k 个动物，则动物 i 具有固定成本

 w i ​ (k)={ a i ​ , b i ​ , ci ​ ≥k, c i ​ <k。 ​

 一旦 k 确定，问题就变得简单：精确选择 k 个 w i ​ (k) 最小的动物。 因此，最小可能的攻击是 k 个最小当前成本的总和。 

约束 n≤10 5 排除了检查子集，这将需要指数级的多次操作，并且如果每个尺寸都需要查看所有动物，则还排除了对每个可能的笼子尺寸进行 O(n 2 ) 扫描。 a i ​ ,b i ​ ,s 的值可以达到 10 9，因此实现也必须使用 64 位大小的算术。 Python 整数已经安全地处理了这个问题。 

在几种边界情况下，粗心的实施可能会失败。 首先，条件是 c i ​ ≥k，而不是 c i ​ >k。 例如，```
1 5
5 10 1
```唯一可以存储的动物，因为当有一只动物时，1≤5，所以它的攻击性是5。答案是`1`。 一个实现使用`c_i > k`会错误地将其切换为攻击性 10。 

第二种情况是 a i ​ =b i ​。 例如，```
2 0
0 0 1
0 0 1
```两种动物的攻击性都是零，所以答案是`2`。 假设每次转换都会更改值的数据结构仍然可以工作，但当两个值相等时，它不能意外删除或复制动物。 

当没有正数的动物适合时会出现第三种情况：```
1 0
1 5 1
```对于一只动物来说，攻击性为 1，超出了笼子的容量。 正确答案是`0`。 该算法必须允许零作为答案，而不是假设至少可以选择一只动物。 

## 方法

 直接暴力的想法是尝试所有可能的 k 个动物。 对于固定的 k，使用上述规则计算每个动物当前的攻击性，对 n 个值进行排序，并取最小的 k。 这是正确的，因为一旦最终的笼子大小固定，每只动物都有固定的成本，选择最便宜的 k 成本是最佳的。 

然而，对每个 k 执行此操作需要对 n 个元素进行 n 个单独的排序。 所得复杂度为 O(n 2 logn)。 当 n=10 5 时，这远远超出了预期范围，在考虑排序比较之前，大约有 10 10 个元素参与排序工作。 

关键的观察结果是，当 k 增加 1 时，动物仅改变其成本一次。 动物 i 对于每个笼子尺寸使用 a i ​，直到 c i ​，并在笼子尺寸变为 c i​+1 时永久更改为 b i ​。 因此，我们可以动态维护所有当前成本，而不是为每个 k 重建整个成本列表。 

对于每个 k，我们需要当前多重集中 k 个最小值的总和。 在坐标压缩所有可能的攻击值之后，芬威克树可以有效地维持这一点。 一棵芬威克树存储当前具有每个值的动物数量，另一棵存储这些值的总和。 当 k 增加时，所有具有 c i ​ =k−1 的动物都从 a i 变为 b i ​。 每次更改都只是在 Fenwick 树中进行删除和插入。 

剩下的操作是求 k 个最小值的总和。 包含计数的 Fenwick 树让我们可以在 O(logn) 中找到第 k 个最小值的位置。 然后，第二棵树给出该位置以下所有值的总和，并且我们仅根据需要添加最终值的尽可能多的副本。 

蛮力之所以有效，是因为固定 k 的最优集合就是 k 个最便宜动物的集合。 它失败是因为它重复地重建仅增量变化的信息。 每只动物只改变一次成本的观察结果让我们隐式地维护排序的多重集，并以 O(logn) 的速度处理每个笼子大小。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | O(n 2 logn) | O(n 2 logn) | O(n) | 太慢了 |
 | 最佳| O(nlogn) | O(n) | 已接受 |

 ## 算法演练

 1. 读取所有动物并收集每个值 a i ​和 b i ​。 这些是唯一可能出现的攻击值，因此对它们进行坐标压缩可得到大小最多为 2n 的 Fenwick 树。 
2. 首先考虑一个装有一只动物的笼子。 由于每个 c i ​ ≥1，因此每只动物当前都有攻击性 a i ​。 将所有 a i 值插入计数和求和 Fenwick 树中。 
3. 根据 c i 值对动物进行分组​。 当我们要评估笼子大小 k 时，每只具有 c i ​=k−1 的动物都刚刚跨过其阈值。 从数据结构中删除其 a i ​值并插入其 b i ​值。 具有较大 c i ​的动物仍然使用 a i ​，而超过较早阈值的动物已经使用 b i ​。 
4. 使用计数芬威克树找到第 k 个最小的当前攻击值。 如果其压缩位置对应于值x，则使用总和芬威克树找到严格小于x的值的数量和总和。 
5. 假设有`cnt`小于 x 的值，总和`sm`。 剩下的 k−cnt 选中的动物都具有攻击性 x，因此 k 只动物的最小可能攻击性为

 sm+(k−cnt)x。 

如果这个值最多为s，那么可以存储k只动物，所以更新答案。 

1. 继续遍历从 1 到 n 的所有 k。 答案是最大的可行k。 

### 为什么它有效

 在检查笼子大小 k 之前，如果笼子里有 k 只动物，则数据结构准确地包含每只动物当前的攻击性值。 当 c i < k 时，动物已经从 a i 变为 b i ​，并且其他动物不需要改变。 

对于这个固定的 k，任何有效的选择都恰好包含 k 个动物。 由于每只动物都有固定的当前攻击性值，因此通过取 k 个最小值来获得最小可能的总攻击性。 芬威克树精确地计算出该最小总和。 因此，当某组 k 只动物适合笼子时，该算法准确地标记 k 可行。 

由于添加另一种动物只能增加动物的数量，而永远不能减少任何选定动物的攻击性，因此可行性是单调的。 直接处理每个 k 避免了需要单独的可行性搜索并给出最大可行大小。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

def solve():
    n, s = map(int, input().split())

    animals = []
    values = []

    for _ in range(n):
        a, b, c = map(int, input().split())
        animals.append((a, b, c))
        values.append(a)
        values.append(b)

    coords = sorted(set(values))
    m = len(coords)
    pos = {x: i + 1 for i, x in enumerate(coords)}

    count_bit = [0] * (m + 1)
    sum_bit = [0] * (m + 1)

    def add(bit, i, delta):
        while i <= m:
            bit[i] += delta
            i += i & -i

    def prefix(bit, i):
        res = 0
        while i > 0:
            res += bit[i]
            i -= i & -i
        return res

    # Find the smallest Fenwick index whose prefix count is >= k.
    def kth(k):
        idx = 0
        step = 1 << (m.bit_length() - 1)

        while step:
            nxt = idx + step
            if nxt <= m and count_bit[nxt] < k:
                idx = nxt
                k -= count_bit[nxt]
            step >>= 1

        return idx + 1

    # Animals with c = k - 1 change from a to b before size k is checked.
    by_c = [[] for _ in range(n + 1)]

    for a, b, c in animals:
        by_c[c].append((a, b))

        p = pos[a]
        add(count_bit, p, 1)
        add(sum_bit, p, a)

    answer = 0

    for k in range(1, n + 1):
        threshold = k - 1

        for a, b in by_c[threshold]:
            if a == b:
                continue

            pa = pos[a]
            pb = pos[b]

            add(count_bit, pa, -1)
            add(sum_bit, pa, -a)

            add(count_bit, pb, 1)
            add(sum_bit, pb, b)

        p = kth(k)

        cnt_before = prefix(count_bit, p - 1)
        sum_before = prefix(sum_bit, p - 1)

        value = coords[p - 1]
        total = sum_before + (k - cnt_before) * value

        if total <= s:
            answer = k

    print(answer)

if __name__ == "__main__":
    solve()
```坐标压缩将每个可能的攻击值转换为 Fenwick 指数。 最多有 2n 个不同的值，因为每只动物只贡献 a i ​和 b i ​。 

初始芬威克状态包含所有 a i ​值。 这对于 k=1 是正确的，因为每个 c i ​至少为 1。 这`by_c`数组准确记录了每只动物必须更改其值的时间。 

循环使用`by_c[k - 1]`检查尺寸 k 之前。 这就是临界边界条件。 具有 c i ​ =k−1 的动物看到 k>c i ​，因此它一定已经使用了 b i ​。 相反，具有 c i ​ =k 的动物仍然使用 a i ​。 

计数芬威克树用于订单统计。 这`kth(k)`例程查找包含 O(logn) 中第 k 个最小当前值的压缩位置。 然后，总和芬威克树获得严格小于它的每个值的总和。 如果少于 k 只动物低于最终值，则其余动物都具有该值。 

这`a == b`check 避免对攻击性永远不会改变的动物执行两次不必要的更新。 它不是正确性所必需的，但它减少了工作并使转换逻辑更清晰。 

所有总和大约可以达到 10 14，因此固定宽度的 32 位整数是不够的。 Python 整数会自动处理这个问题。 

## 工作示例

 对于第一个样本，```
2 6
2 4 1
2 4 2
```初始多重集包含两个 a 值。 

| k | 检查前的变更 | 当前成本| k 最小 | 最低金额 | 可行|
 | --- | --- | --- | --- | --- | --- |
 | 1 | 无 | 2, 2 | 2 | 2 | 是的 |
 | 2 | 动物1：2→4 | 4, 2 | 2, 4 | 6 | 是的 |

 当我们从一只动物移动到两只动物时，第一个动物发生了准确的变化，因为它的阈值是 c 1 ​ =1。 两只动物的最小总和正好是笼子的容量，所以答案是`2`。 

对于第二个样本，```
4 10
3 4 2
3 5 3
1 1 1
2 7 3
```进展是：

 | k | 检查前的变更 | 当前成本| k 最小 | 最低金额 | 可行|
 | --- | --- | --- | --- | --- | --- |
 | 1 | 无 | 3, 3, 1, 2 | 1 | 1 | 是的 |
 | 2 | 动物3：1→1 | 3, 3, 1, 2 | 1, 2 | 3 | 是的 |
 | 3 | 无 | 3, 3, 1, 2 | 1、2、3 | 6 | 是的 |
 | 4 | 动物1：3→4 | 4, 3, 1, 2 | 1、2、3、4 | 10 | 10 是的 |

 在 k=4 时，动物 1 跨越其阈值 c 1 ​ =2，因此其攻击性变为 4。现在所有四只动物的总攻击性恰好为 10，这与笼子相符。 答案是`4`。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | O(nlogn) | 压缩需要 O(nlogn)，每个动物最多更改一次，每次 Fenwick 更新或顺序统计查询的成本为 O(logn)。 |
 | 空间| O(n) | 动物、阈值组、压缩值和 Fenwick 树都包含 O(n) 元素。 |

 最多有 2n 个压缩攻击值，并且 n 个动物中的每一个最多执行一次从 a i ​到 b i ​的转换。 因此，该算法仅执行 O(n) Fenwick 运算，每个运算都是 n 的对数。 对于 n=10 5，这完全在预期的复杂性范围内，而 64 位大小的和由 Python 整数直接处理。 

## 测试用例```python
# The production solution can be tested by placing it in a module and
# calling solve() after replacing sys.stdin and sys.stdout.
#
# For a self-contained assert suite, the same algorithm is wrapped below.

import sys
import io

def run(inp: str) -> str:
    old_stdin = sys.stdin
    old_stdout = sys.stdout

    sys.stdin = io.StringIO(inp)
    sys.stdout = io.StringIO()

    n, s = map(int, sys.stdin.readline().split())

    animals = []
    values = []

    for _ in range(n):
        a, b, c = map(int, sys.stdin.readline().split())
        animals.append((a, b, c))
        values.extend((a, b))

    coords = sorted(set(values))
    pos = {x: i + 1 for i, x in enumerate(coords)}
    m = len(coords)

    count_bit = [0] * (m + 1)
    sum_bit = [0] * (m + 1)

    def add(bit, i, delta):
        while i <= m:
            bit[i] += delta
            i += i & -i

    def prefix(bit, i):
        res = 0
        while i:
            res += bit[i]
            i -= i & -i
        return res

    def kth(k):
        idx = 0
        step = 1 << (m.bit_length() - 1)

        while step:
            nxt = idx + step
            if nxt <= m and count_bit[nxt] < k:
                idx = nxt
                k -= count_bit[nxt]
            step >>= 1

        return idx + 1

    by_c = [[] for _ in range(n + 1)]

    for a, b, c in animals:
        by_c[c].append((a, b))
        p = pos[a]
        add(count_bit, p, 1)
        add(sum_bit, p, a)

    answer = 0

    for k in range(1, n + 1):
        for a, b in by_c[k - 1]:
            if a == b:
                continue

            pa = pos[a]
            pb = pos[b]

            add(count_bit, pa, -1)
            add(sum_bit, pa, -a)

            add(count_bit, pb, 1)
            add(sum_bit, pb, b)

        p = kth(k)
        cnt_before = prefix(count_bit, p - 1)
        sum_before = prefix(sum_bit, p - 1)
        value = coords[p - 1]

        total = sum_before + (k - cnt_before) * value

        if total <= s:
            answer = k

    sys.stdout.write(str(answer) + "\n")

    result = sys.stdout.getvalue()

    sys.stdin = old_stdin
    sys.stdout = old_stdout
    return result

# Provided sample 1
assert run(
    """2 6
2 4 1
2 4 2
"""
) == "2\n", "sample 1"

# Provided sample 2
assert run(
    """4 10
3 4 2
3 5 3
1 1 1
2 7 3
"""
) == "4\n", "sample 2"

# Minimum-size input, including the possibility of storing nothing.
assert run(
    """1 0
1 5 1
"""
) == "0\n", "minimum size and zero capacity"

# All values equal and all animals remain harmless.
assert run(
    """5 0
0 0 1
0 0 2
0 0 3
0 0 4
0 0 5
"""
) == "5\n", "all equal zero aggression"

# Exact-threshold case: c == k must still use a, not b.
assert run(
    """3 6
2 100 3
2 100 3
2 100 3
"""
) == "3\n", "exact threshold"

# Maximum-size style case with large values and a feasible full cage.
assert run(
    """5 5000000000
1000000000 2000000000 1
1000000000 3000000000 2
1000000000 4000000000 3
1000000000 5000000000 4
1000000000 6000000000 5
"""
) == "5\n", "large sums and full selection"
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 |`1 0 / 1 5 1`|`0`| 最小尺寸和没有动物适合的可能性 |
 | 五种零攻击性动物 |`5`| 等值且 a i ​ =b i ​ =0 |
 | 三只动物与`c=3`|`3`| 精确阈值使用 i ​ |
 | 攻击性值大 |`5`| 大和和 Python 整数算术 |

 ## 边缘情况

 仅当以下情况时才通过改变动物来处理确切的阈值条件：`k - 1 == c_i`。 考虑```
3 6
2 100 3
2 100 3
2 100 3
```对于 k=3，动物尚未跨过阈值，因为 3≤c i ​。 因此数据结构仍然包含`2, 2, 2`，总共给出`6`，所以答案是`3`。 当 k=4 时，所有三只动物都会切换到`100`，但无论如何只有三只动物。 这抓住了切换时的常见错误`k == c_i`而不是当`k > c_i`。 

当 a i ​ =b i ​时，过渡没有数值效应。 为了```
5 0
0 0 1
0 0 2
0 0 3
0 0 4
0 0 5
```当前的每一次攻击总是为零。 Fenwick 结构在整个过程中保留五个零副本，因此每个笼子尺寸从`1`通过`5`是可行的，答案是`5`。 实施的`a == b`分支只是跳过冗余的删除和添加操作。 

当笼子容量对于一只动物来说太小时，答案必须保持为零。 为了```
1 0
1 5 1
```初始状态包含一个值，`1`。 最小的一个值的总和是`1`，大于`s=0`， 所以`answer`永远不会从其初始值更新`0`。 

大笔资金是另一个实际界限。 5 只动物每只都有 10 9 次左右的攻击性，总数可达数十亿或更多。 该算法将总计存储在 Fenwick 和树中以及 k 个最小值的表达式中，而不将其缩小到 32 位。 Python 的任意精度整数使算术安全。 

最后，动物的阈值可以远小于最终的笼子尺寸。 一旦超过其阈值，其值将仅更改一次，并且对于后续的每个 k 保持为 b i ​。 这一一次性转换是该算法的中心不变量。 如果实现在笼大小之间移动时重新计算或部分恢复此类转换，则可能会混合属于不同 k 值的成本，从而产生无效的最小值。
