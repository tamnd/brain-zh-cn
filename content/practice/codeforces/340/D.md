---
title: "CF 340D - 冒泡排序图"
description: "给定问题理解的排列 我们得到了从 1 到 n 的数字排列。 从 1 到 n 的数字。 想象一下，在这个排列上运行冒泡排序，然后在这个排列上运行普通的冒泡排序。"
date: "2026-06-06T17:17:43+07:00"
tags: ["codeforces", "competitive-programming", "binary-search", "data-structures", "dp"]
categories: ["algorithms"]
codeforces_contest: 340
codeforces_index: "D"
codeforces_contest_name: "Codeforces Round 198 (Div. 2)"
rating: 1500
weight: 340
solve_time_s: 125
verified: true
draft: false
---

[CF 340D - 冒泡排序图](https://codeforces.com/problemset/problem/340/D)

 **评分：** 1500
 **标签：** 二分查找、数据结构、dp
 **求解时间：** 2m 5s
 **已验证：** 是的

 ## 解决方案
 给定##问题理解的排列

 我们得到了以下数字的排列`1`到`n`。 

从 1 到 n 的数字。 想象一下，在这个排列上运行冒泡排序，然后在这个排列上运行普通的冒泡排序。 每次冒泡排序都会在排列中找到两个相邻元素。 每次冒泡排序在两个相邻的错误顺序之间执行交换并交换它们时，我们在元素之间添加一条无向边，在两个被交换的值之间添加一条无向边。 正在交换的图表值。 

冒泡排序完成后，我们的顶点就是值`1...n`。 

冒泡排序后得到一个图，其顶点为数字 1 到 n。 任务完成，我们得到一个图，其边记录每一个不是为了模拟图本身，而是为了找到发生的交换。 任务是找到最大独立集的大小，这意味着该图中最大的集合独立集，意味着任何没有边的顶点集合之间没有边的最大顶点。 

他们之间的第一个挑战。 

首先是了解图冒泡排序实际上创建了什么。 一个直接的挑战是理解冒泡排序的图形模拟可能会实际创建什么。 直接模拟高达 O(n²) 交换的冒泡排序。 与 n 可以要求`O(n² large as 100000, that would be roughly 10¹⁰ operations in)`互换。 和`n`最多` the worst case, which is completely impossible within a100000`，大约是一秒的时间限制。 

约束条件是`10^10`在最坏的情况下，输入是排列的操作是极其重要的。 每在一秒钟之内都是完全不可能的。 

约束强值只出现一次，这表明该图具有某种隐藏结构。 互换的强大结构。 

我们需要一个通用的算法`O(n log n)`。 

一个错误是认为每个反转都会成为一个边缘，这是常见的错误。 考虑：```text
3
3 1 2
```反转是 (3, 一条边。考虑：```text
3
3 1 2
```反转是`(3,1)`和`(3,1) and (3,2). Bubble sort indeed2)`，实际上两者都创建边 (3,1) 和 (3,2)，因此成为边。 但这个例子并不真实，因为没有揭示差异。 

一个更具启发性的例子是：``` of inversions in general,text
4
4 1 3  it is true because bubble sort eventually2
```反转直接交换这些对。 

存在另一个诱人的对 (4,2)，但这些错误是显式构造图，值永远不会直接交换。 冒泡排序仅交换相邻元素，然后运行最大独立集算法。 最大独立集。 在任意图上将每个反演视为一条边是 NP 困难的，因此会构建错误的图。 

另一种容易被认为是错误的方法是显式地构建图表，然后就无望了。 关键的观察是该图解决了其上的最大独立集问题。 一般最大独立设置很特别。 

考虑：```text
4
 is NP-hard, so if the graph were arbitrary this4 1 2 3
```泡沫将毫无希望。 排序的隐藏结构创建边缘`(4,1)`,`(4,2)`,`(4,3)`。 图是整个最大独立集有大小`3`，即问题的点。 

最后的微妙`{1,2,3}`。 通用图例是一个已经排序的排列：

 算法会忽略这个图来的事实```text
5
1 2 3 4 5
 from a very structured process.

A useful edge case is an```没有发生交换，因此图已经排序排列：```text
5
1 2 3 4  has no edges. The answer is 55
```没有发生交换，因此图没有边。 最大独立集包含每个顶点，因为每个顶点都可以属于独立集。 任何假设的解决方案，答案是`5`。 

相反的极端：```text
5
 at least one edge exists will fail here.

## Approaches

5 4 3 2 1
```每对最直接的想法就是模拟气泡形成反转。 冒泡排序完全按照所描述的排序最终准确地交换每个倒排对。 每次两次，产生一个完整的图。 最大独立集大小为`1`。 

了解相邻值被交换后，我们在它们之间添加一条边。 在收集了为什么这两个极端对应于清空所有边之后，我们可以尝试计算完整的图表，直接得出主要见解。 

## 接近最大独立集。 

模拟

 蛮力解释很简单。 模拟冒泡排序本身已经花费了 O(n²) 的成本，与所描述的完全一样，添加每条边（最坏的情况），因为冒泡排序可能会执行 θ 构建结果图，然后计算其 (n²) 交换。 对于 n = 100000 最大独立集。 

即使构建图表，这也是远远不可行的。 

更糟糕的是方法太慢。 冒泡排序执行，在一般图中找到最大独立集是计算性的`O(n²)`比较和困难。 所以暴力破解都失败了，因为图交换了。 为了`n =  construction is too expensive and because the resulting optimization problem appears in100000`，操作次数是可推论的。 

关键的观察结果是气泡产生的图表超出了实际限制。 

下一个观察是非常特殊的关键观察：in。 

考虑两个值 x 和 y，其中 x > y。 

冒泡排序，当且仅当它们在原始排列中形成反转时，如果 x 出现在 y 之前，则交换两个值。 

进行排列，然后它们形成倒置。 两个值`x > y`。 如果`x`在冒泡排序过程中，x 最终必须超过 y。 由于之前出现过`y`，它们形成反转。 冒泡交换是相邻的，恰好有一个时刻 x 和 y 变得相邻并且交换排序最终移动`x`正确的。 此时，一条边 (x,y)ward 和`y`向左，直到它们变得相邻，添加at。 

如果 x 最初出现在 y 之后，则它们已经是它们被交换一次的点。 如果它们的相对顺序正确并且永远不会交换。 

这最初不是倒置，它们的相对顺序永远不会改变意味着：

 两个顶点相连并且永远不会交换。 

这意味着当且仅当它们在原始排列中形成反转。 

图恰好包含每个反演对的一条边。 

现在假设我们选择现在根据形成独立集合的顶点重写反演条件。 没有职位。 让`pos[v]`成为价值地位`v`在排列中。 

对于价值观`u < two selected vertices may form an inversion. Thus, among the selected v`，它们在图形值中相邻，它们在排列中的顺序必须已经恰好是当```text
pos[u] > pos[v]
`` increasing.

That is exactly the definition of an`

In other words, the graph is a increasing subsequence.

Conversely, every increasing subsequence contains no permutation graph.

An independent set cannot inversion pair, so its vertices form an independent set.

We have established a bijection:

Maximum independent set contain two vertices connected by an edge. Therefore, if we choose values size = Longest Increasing Subsequence length.

Once

```文本
 x1 < x2 < ... < x 问题简化为 LIS，wek```

inside an independent set, we must have

```文本
 可以使用标准 pos[x1] < pos[x2] < ... < pos[xk] 在 O(n log n) 中解决它```

Otherwise patience-sorting technique with binary search.

| Approach | Time Complexity some pair would form an inversion and create an edge.

So | Space Complexity | Verdict |
|---|---|---|---|
| Brute Force an independent set corresponds exactly to a subsequence of values whose positions are bubble-sort simulation + graph reasoning increasing.

If we list the positions in | O(n²) or worse | O(n² value order:

```文本
 位置[1], 位置[2], ...,) | 太慢了 |
 | LIS 减少 pos[n]```

then the | O(n log n) | O(n) | Accepted |

## Algorithm answer becomes the length of the Longest Increasing Subsequence Walkthrough

1. Read the permutation.

2. Maintain an of this sequence.

Computing LIS in ` array `tails`.

   `tails[i]`O(n log n)` is a standard technique will store the smallest possible ending value of and easily fits the constraints.

| Approach | Time Complexity | an increasing subsequence of length `i + 1`.

3. Process Space Complexity | Verdict |
|---|---|---|---|
| Brute Force | the permutation from left to right.

4. O(n²) or worse | O(n² For the current value `x`,) | Too slow |
| Optimal (LIS) | O(n log n) | find the first position in `tails` whose O(n) | Accepted |

## Algorithm Walkthrough value is greater than or equal to `x`.

   This

1. Read the permutation.

2. Build an array ` position can be found with binary search.

5. If nopos` where `pos[v]` stores the position such position exists, append `x` to `tails`.

   This of value `v` in the permutation.

3. Construct the sequence:

   means we have found a longer increasing subsequence than any ```文本
 pos[1], pos[2]，之前见过。 

6. 否则，替换..., pos[n]```

   This sequence describes position with `x`.

   A smaller ending value is where each value appears.

4. Compute the Long always better because it leaves more room forest Increasing Subsequence of this sequence using the standard patience future elements to extend the subsequence.

7. After-sorting method.

5. Maintain an all values are processed, the array `tails`.

   `tails[len-1]` stores length of `tails` equals the length of the the smallest possible ending value of Longest Increasing Subsequence.

8. Output that length.

### Why it works an increasing subsequence of length `len`.

6. Process the

An edge exists exactly between pairs of position sequence from left to right.

   For each position value ` values that form inversions in the original permutation.

x`, find the first element in `tails` thatAn independent set cannot contain two adjacent vertices of the graph is greater than or equal to `x`.

7. If. Therefore it cannot contain an inversion pair. The no such element exists, append `x` to `tails`.

   This selected values must appear in increasing order within the permutation.

Convers means we found a longer increasing subsequence.

8. Otherwise replace that element with `x`.

ely, every increasing subsequence contains no inversion pair. Since   A smaller tail is always no inversion pair exists, no edge exists between any two preferable because it leaves more room for future extensions.

9. After processing all elements, the chosen vertices, making it an independent set.

Thus independent sets and increasing subsequences length of `tails` is the LIS length.

10. Output are exactly the same objects viewed that length.

### Why it works

Every graph from two different perspectives. Maximizing one is edge corresponds to an inversion pair.

Take any independent set and equivalent to maximizing the other.

The patience-sorting LIS algorithm is sort its vertices by value:

```文本
 v 已知计算最大递增子序列长度，因为 1 < v2 < ... < vk```

Since no pair `tails[k]` always stores the smallest achievable ending value is connected, none of these pairs forms of a subsequence of length `k + 1`. Binary an inversion. Hence

```文本
 pos[v1] < pos[v2] < ... < 搜索在每次更新后都会保留此不变量。 

## Python 解决方案``` pos[vk]
```位置形成递增子序列python
 导入系统
 从二等分导入 bisect_left

 输入=.

 相反，假设值```text
 sys.stdin.readline

def solve():
    n = int(input())
    a = list(map(int,v1 < v2 < ... < vk
```增加输入().split()))

 尾巴=[]

 对于 a 中的 x：
 pos = bisect_left 位置。 然后没有对形成反转，因此任何对之间不存在边。(tails, x)

 如果 pos == len(尾部):
 尾部.append(x)
 它们形成一个独立的集合。 

因此还有一个：
 尾部[位置] = x

 打印（长度（尾部））

 如果 __name__ == "__main__":
 独立集合和递增子序列之间的一一对应关系```text
pos[1], solve()
```解决方案永远不会是 pos[2], ..., pos[n]。```

The maximum independent set size is constructs the graph.

The crucial observation is the equivalence between exactly the LIS length of that sequence.

## Python Solution

```蟒蛇
 导入图独立集和递增子序列。 一旦减少系统
 从二等分导入 bisect_left

 input = 成立，余数为标准LIS sys.stdin.readline

 def 求解():
 n = int(输入())
 a = 列表(map(int, input().split()))

 计算。 

数组`tails`按排序顺序维护。 位置 = [0] * (n + 1)
 使用`bisect_left`在 enumerate(a) 中查找 for i, v：
 位置[v] = 我

 尾巴=[]

 当前值可以替换现有尾部的第一个位置。 由于 v 在 range(1, n + 1) 中：
 x = 位置[v]
 输入是一个排列，所有值都是不同的，但 idx = bisect_left(tails, x)

 如果 idx == len(尾部):`bisect_left`仍然是 tails.append(x) 的正确选择
 其他：
 尾部[idx] = x

 标准严格递增LIS算法。 

当 `pos == print(len(tails)) 时

 如果 __name__ == "__main__":
 解决 len(tails)`，当前值扩展迄今为止找到的最长子序列()```

The first part builds the inverse. Otherwise we replace an existing tail. permutation `pos`. Instead of asking which value sits at each position, The replacement does not reduce any achievable subsequence length, it we ask where each value sits.

The sequence `pos[1], pos[ only improves future extension opportunities by making the ending2], ..., pos[n]` is exactly value smaller.

No overflow concerns the object whose LIS we need.

The ` exist because all values are at most 100000.

## Worked Examples

###tails` array implements the standard ` Example 1

Input:

```文本
 3
 3 1 2
 O(n log n)` LIS algorithm. Using `左二等分````

| Current value | is the correct choice because LIS requires strictly increasing values tails before | Position. Replacing the first tail | tails after |
|---|---|---|---|
| 3 | [] greater than or equal to the current value | 0 | [3] |
| 1 | [ preserves the optimal invariant that3] | 0 | [1] |
| 2 | [ each subsequence length keeps the smallest possible ending position1] | 1 | [1, 2] |

Final.

No integer-overflow issues exist because all values are at LIS length = 2.

Output:

```文本
 大多数`100000`。 

## 工作示例

 ### 示例 1

 输入：```text
3
3 2
```这对应于独立集{1 2```

Positions:

| Value | Position1,2}. The graph contains edges (3,1) and (3,2), |
|---|---|
| 1 | 1 |
|  so vertex 3 cannot coexist with either2 | 2 |
| 3 | 0 |

Position sequence:

```其中。 

### 示例 2

 输入：```text
5
1 2 3 text
[1, 2, 0]
```LIS 跟踪：

 | 当前 x | 之前的尾巴| 尾巴之后|
 |---|4 5```

| Current value | tails before | Position | tails after |
|---|---|---|---|
| 1 | [] | 0 |---|---|
| 1 | [] | [1] |
| [1] |
| 2 | [1] | 1 | [ 2 | [1] | [1, 2] |
| 0 | [1, 2] |
| 3 | [1, 2] | 2 | [1, 2] | [0, 2] |

Final LIS1, 2, 3] |
| 4 | [1, 2, length = 2.

Answer:

```文本
 2```

This corresponds 3] | 3 | [1, 2, 3, 4] |
| 5 | [1, 2, 3, 4] | 4 | [ to choosing values `{1,2}`. Their1, 2, 3, 4, 5] |

Final LIS positions are increasing, so no inversion exists between them.

### Example 2

Input:

```文本
 5
 5 4 3 2 1```

 length = 5.

Output:

```文本
 5```

No inversPositions:

| Value | Position |
|---|---|
| 1 | 4 |
ions exist, so bubble sort performs no swaps and the graph has no edges. Every| 2 | 3 |
| 3 | 2 |
| 4 | 1 |
|  vertex belongs to the maximum independent set.

## Complexity Analysis

| Measure | Complexity | Explanation |
|---5 | 0 |

Position sequence:

```文本
 [4, 3, |---|---|
 | 时间 | O(n log n) | O(n log n) | 一2, 1, 0]```

LIS trace:

| Current binary search for each of n elements |
| Space | x | tails before | tails after |
|---|---|---|
|  O(n) | The `tails` array may contain up to n values |

With n4 | [] | [4] |
| 3 | [4] | [3] |
| ≤ 100000, O(n log n) performs roughly a 2 | [3] | [2] |
| 1 | [2] | few million primitive operations, which easily fits within the time [1] |
| 0 | [1] | [0] |

Final LIS limit. The memory usage is linear and well below length = 1.

Answer:

```文本1```

This the 256 MB limit.

## Test Cases

```蟒蛇
 # 演示完整图的情况。 每对助手：对输入字符串运行解决方案，返回输出字符串
 导入系统
 是一种反转，因此只能选择一个顶点 import io
 从二等分导入 bisect_left

 定义。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 |--- 运行(inp: str) -> str:
 系统|---|---|
 | 时间 | O(n log n) | O(n log n) | One.stdin = io.StringIO(inp)

 n = int(sys.stdin.readline())
 a = 列出每个值的 LIS 插入 |
 |(map(int, sys.stdin.readline().split()))

 尾巴=[]

 空间| O(n) | 位置数组和LIS结构|

 对于 a 中的 x：
 pos = bisect_left(尾部,与`n = 100000`, `n x)
 如果 pos == len(尾部):
 尾部.append(x)
 log n` 大约是几百万个原语 else：
 尾部[位置] = x

 return str(len(t 个操作，在时间限制内轻松完成。Theails))

 # 提供的样本
 assert run("3\n3 1 内存使用量是线性的并且远低于 2\n") == "2", "sample 1"

 # 最小尺寸，已排序
 断言可用 256 MB。 

## 测试用例```python
# run("2\n1 2\n") == "2", "minimum sorted helper: run solution on input string, return output string
import sys, io
"

# minimum size, reversed
assert run("2\n2 1\n") == "1", "from bisect import bisect_left

def run(inp: str) -> str:
    sys.stdinminimum reversed"

# fully increasing
assert run("5\n1 2 3  = io.StringIO(inp)

    n = int(sys.stdin.readline())
    a = list(map(int,4 5\n") == "5", "all vertices independent"

# fully sys.stdin.readline().split()))

    pos = [0] * (n + 1)
    decreasing
assert run("5\n5 4 3 2 1\n") for i, v in enumerate(a):
        pos[v] = i

    tails = []

    == "1", "maximum inversion case"

# common for v in range(1, n + 1):
        x = pos[v]
        idx = bisect LIS example
assert run("6\n3 1 _left(tails, x)

        if idx == len(tails):
            tails5 2 6 4\n") == "3",.append(x)
        else:
            tails[idx] = x

    return str(len(tails))

# "general case"
```| 测试输入| 提供样本的预期输出
 assert run("3\n3 1 2\n") == "2", " | 它验证什么 |
 |---|---|---|
 | `2 / 样品 1"

 # 最小尺寸，已排序
 断言运行("2\n1 21 2` | `2`| 最小\n") == "2", "最小排序"

 # 最小尺寸，反转
 断言运行（“排序排列 |
 |`2 / 2 1`|`1`| 最小非平凡反演 |
 | `5 / 2\n2 1\n") == "1", "最小反转"

 # 已经排序了
 断言1 2 3 4 5` | `5`| 图 run("5\n1 2 3 4 5\n") == "5", "空图"

 # 没有边缘 |
 |`5 / 5 4 3 2 1`| ` 完全相反
 断言 run("5\n5 4 3 2 1\n") == "1", "完整图"

 # 混合大小写
 断言 run("4\n1` | 最大反转密度 |
 |`6 / 3 1 5 2 6 4`|`2 1 4 3\n") == "2", "two independent3`| 一般 LIS 行为 |

 ## 边缘情况

 考虑成对”```

| Test input | Expected output | the already sorted permutation:

```文本
 5
 1 它验证了什么 |
 |---|---|---|
 | `2 / 2 3 4 5```

Bubble sort performs no1 2` | `2` | Minimum swaps. The graph contains five size, no inversions |
| `2 / 2  isolated vertices. The LIS algorithm1` | `1` | Minimum size, one inversion |
 produces length 5 because every| `5 / 1 2 3 4 5` element extends the current subsequence. | `5` | Empty graph case |
| `5 / 5  The answer is correctly4 3 2 1` | `1` | 5.

Consider the reverse permutation:

```文本
 5
 完整图例|
 | `4 / 2 1 4 5 4 3 2 1```

Every3` | `2` | Mixed inversion structure |

## Edge Cases

 pair forms an inversion. The graph becomes complete, meaningConsider the sorted permutation:

```文本
 5
 1 2 每对顶点都是相邻的。3 4 5```

The Any independent set can contain only position sequence is:

```文本
 [0,1，一个顶点。 LIS长度也是2,3,4]```

Its LIS 1, which the algorithm returns length is `5`..

 Bubble sort performs no swaps, so theConsider a permutation where not every inversion corresponds to graph has no edges. Every vertex belongs to the an obvious adjacent pair:

```文本
 4
 4 1 3 2
 `` maximum independent set. The algorithm returns`LIS 是`[1, 3] `5`.

 现在考虑逆排列` or `[1, 2]`，两者：```text
5
5 4 3 2 1
 of length 2. The algorithm computes```位置顺序为：```text
[4,3, 2. This demonstrates why the reduction is2,1,0]
```其LIS长度为`1`。 基于反转对而不是每对值形成一个反转，产生而不是试图跟踪单个冒泡排序通过完整的图。 任何独立集最多包含一个顶点。 每一次反转都精确地创造出来。 算法正确返回`1`。 

一个更微妙的例子是一个边缘，无论交换何时发生。 

是：```text
4
4 1 2 3
```考虑：```text
6
2 1 4 3 6 5
```位置顺序为：```text
[1,2,3,0]
```反演是独立的局部对。 LIS 长度为`3`。 

冒泡排序创建边`(4,1)`，LIS长度为3，例如`[2,4,6]`或者`[ `(4,2)`, `(4,3)` and nothing else. Values `{1,2,3}`1,3,5]`。 该算法返回 3，它们之间没有边，匹配给出一组独立大小的最大值`3`。 与算法无关的设置大小。 这证实了多个不连续的反演结构通过增加被 LIS 子序列自然地处理。`[1,2,3]`。 

这些例子涵盖了主要的陷阱并说明了为什么要这样表述。 图结构相当于一个LIS问题。
