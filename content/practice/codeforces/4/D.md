---
title: "CF 4D - 神秘礼物"
description: "我们得到了一组信封，每个信封都有宽度和高度。 明信片已经具有固定尺寸，我们希望构建尽可能最长的信封嵌套链，以便："
date: "2026-05-28T00:00:00+07:00"
tags: ["codeforces", "competitive-programming", "dp", "sortings"]
categories: ["algorithms"]
codeforces_contest: 4
codeforces_index: "D"
codeforces_contest_name: "Codeforces Beta Round 4 (Div. 2 Only)"
rating: 1700
weight: 4
solve_time_s: 77
verified: true
draft: false
---
[CF 4D - 神秘礼物](https://codeforces.com/problemset/problem/4/D)

 **评分：** 1700
 **标签：** dp、排序
 **求解时间：** 1m 17s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们得到了一组信封，每个信封都有宽度和高度。 明信片已经具有固定尺寸，我们希望构建尽可能最长的信封嵌套链，以便：

 - 明信片适合第一个信封，
 - 每个下一个信封的宽度和高度都严格大于前一个信封。 

禁止旋转，因此宽度必须直接与宽度比较，高度与高度直接比较。 

输出不仅是最大链长度，而且是按递增嵌套顺序排列的一个有效的包络索引序列。 

最重要的约束是`n ≤ 5000`。 对所有子集或所有排列进行强力搜索是不可能的，因为即使`2^5000`或者`5000!`是一个天文数字。 另一方面，二次动态规划大约`5000^2 = 25,000,000`比较在 C++ 中是完全现实的，并且在仔细实现的 Python 中仍然可以接受。 

问题本质上是要求两个维度都严格增加的最长序列。 这立即表明排序后最长的递增子序列样式动态规划解决方案。 

一些边缘情况可能会悄悄地破坏不正确的实现。 

假设多个信封具有相同的尺寸。 

输入：```
3 1 1
2 2
2 2
3 3
```正确输出：```
2
1 3
```两人`(2,2)`信封不能同时出现在链中，因为增加必须在两个维度上都是严格的。 粗心的 LIS 实现使用`>=`而不是`>`会错误地允许他们。 

当信封仅适合一个维度时，会发生另一种棘手的情况。 

输入：```
3 2 2
3 2
2 3
4 4
```正确输出：```
1
3
```两者都不`(3,2)`也不`(2,3)`可以容纳明信片，因为两个尺寸都必须严格大于。 仅有的`(4,4)`作品。 仅按面积或一维进行过滤在此会失败。 

当没有信封可以容纳明信片时，就会出现第三种边缘情况。 

输入：```
2 5 5
5 6
6 5
```正确输出：```
0
```严格的不平等再次变得重要。 等宽或等高是不够的。 

## 方法

 蛮力的想法很简单。 我们可以尝试信封的每个子集，然后检查该子集中的信封是否可以排序到有效的链中。 这是有效的，因为有效链的定义很容易验证：每个连续的对必须在两个维度上严格增加。 

问题是子集的数量。 和`n = 5000`，甚至迭代所有子集也是不可能的。 尝试每一个可能的延续的递归搜索也会呈指数爆炸，因为每个信封可以分支成许多更大的信封。 

问题的结构给出了一条更清晰的路径。 如果信封`A`可以放在信封之前`B`， 然后`B`在两个维度上都必须严格大于。 对信封进行排序后，我们可以将其视为有向无环图，其中边总是向较大的信封移动。 一旦图变成无环的，最长路径动态规划就变得自然了。 

排序是关键的观察。 按宽度和高度排序后，任何有效的链都必须按排序顺序向前移动。 那么我们只需要计算：`dp[i] = longest valid chain ending at envelope i`对于每个较早的信封`j`，如果两个维度`j`比那些小`i`， 然后`i`可以延长结束于的链`j`。 

这让这个问题变成了经典`O(n^2)`动态规划解决方案。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | O(2^n) | O(2^n) | O(n) | 太慢了 |
 | 带排序的最优 DP | O(n^2) | O(n^2) | O(n) | 已接受 |

 ## 算法演练

 1. 阅读所有信封并保留其原始索引。 

我们必须按照原始输入顺序打印索引，因此每个信封应该存储`(width, height, original_index)`。 
2. 取出无法容纳明信片的信封。 

信封仅在以下情况下才可用：```
width > postcard_width
height > postcard_height
```任何不符合此条件的信封永远不会出现在有效的链中。 
3. 将剩余信封按宽度排序，然后按高度排序。 

这保证了每当我们从左向右移动时，宽度都不会减小。 它减少了搜索空间，因为有效的转换只需要考虑较早的包络。 
4. 初始化动态编程数组。 

让：```
dp[i] = length of longest chain ending at i
parent[i] = previous envelope index in that chain
```最初，每个信封形成一条长度链`1`。 
5. 对于每个信封`i`，检查所有较早的信封`j`。 

如果：```
width[j] < width[i]
height[j] < height[i]
```然后信封`i`可以延长结束于的链`j`。 

更新：```
dp[i] = dp[j] + 1
parent[i] = j
```每当这给出更长的链时。 
6. 找到最大的信封`dp[i]`。 

这是最优链的末端。 
7. 使用以下方法重建链`parent`大批。 

从最佳端点开始，反复跟随父母向后，直到`-1`。 
8. 反转重建的序列并打印它。 

重建是向后进行的，从最大的信封到最小的信封。 

### 为什么它有效

 排序后，每个有效链都以递增的索引顺序出现，因为宽度和高度都必须严格增加。 DP 转换会考虑所有可能合法地先于当前包络的前一个包络。 自从`dp[j]`已经存储了结尾为的最佳链`j`，将其扩展为`i`给出最好的链结束于`i`。 

递归只会对每个有效的前驱探索一次，因此不会错过任何可能的链。 全部最大`dp[i]`value 是最长的有效嵌套链。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

def solve():
    n, w, h = map(int, input().split())

    envelopes = []

    for i in range(1, n + 1):
        x, y = map(int, input().split())

        if x > w and y > h:
            envelopes.append((x, y, i))

    if not envelopes:
        print(0)
        return

    envelopes.sort()

    m = len(envelopes)

    dp = [1] * m
    parent = [-1] * m

    best_len = 1
    best_idx = 0

    for i in range(m):
        wi, hi, _ = envelopes[i]

        for j in range(i):
            wj, hj, _ = envelopes[j]

            if wj < wi and hj < hi:
                if dp[j] + 1 > dp[i]:
                    dp[i] = dp[j] + 1
                    parent[i] = j

        if dp[i] > best_len:
            best_len = dp[i]
            best_idx = i

    path = []

    cur = best_idx

    while cur != -1:
        path.append(envelopes[cur][2])
        cur = parent[cur]

    path.reverse()

    print(best_len)
    print(*path)

solve()
```第一部分立即过滤不可用的信封。 这简化了 DP，因为每个剩余的信封都保证适合明信片。 

排序使用 Python 的默认元组排序，因此信封首先按宽度排序，然后按高度排序。 由于过渡仍然需要在两个维度上进行严格比较，因此相等的宽度或相等的高度永远不会创建无效的链。 

DP 循环将每个较早的包络检查为可能的前身。 和`5000`对于信封，最坏情况下的比较次数约为 2500 万次，这在 Python 中迭代实现时是可以接受的。 

这`parent`数组对于重建至关重要。 如果没有它，我们可以计算最大链长度，但不知道哪些信封形成了该链。 

一个微妙的细节是使用严格的不等式：```
wj < wi and hj < hi
```将它们替换为`<=`会错误地允许链条具有相同的尺寸。 

另一个微妙的点是排序之前的过滤。 如果仍有无法使用的信封，摄影指导可能会意外地从无法容纳明信片的信封开始构建链条。 

## 工作示例

 ### 示例 1

 输入：```
2 1 1
2 2
2 2
```过滤排序后：

 | 我| 信封| 原始索引 |
 | --- | --- | --- |
 | 0 | (2,2) | 1 |
 | 1 | (2,2) | 2 |

 DP进展：

 | 我| 信封| 有效 上一个 | dp[i] | dp[i] | 父级[i] |
 | --- | --- | --- | --- | --- |
 | 0 | (2,2) | 无 | 1 | -1 |
 | 1 | (2,2) | 无 | 1 | -1 |

 最佳链条长度为`1`。 

一个有效答案：```
1
1
```这个例子说明了为什么严格的不平等很重要。 尽管信封是相同的，但两个信封都不能包含另一个。 

### 示例 2

 输入：```
5 1 1
2 3
3 4
4 5
3 3
5 6
```分类信封：

 | 我| 信封| 原始索引 |
 | --- | --- | --- |
 | 0 | (2,3) | 1 |
 | 1 | (3,3) | 4 |
 | 2 | (3,4) | 2 |
 | 3 | (4,5) | 3 |
 | 4 | (5,6) | 5 |

 DP进展：

 | 我| 信封| 上一个最佳 | dp[i] | dp[i] | 父级[i] |
 | --- | --- | --- | --- | --- |
 | 0 | (2,3) | 无 | 1 | -1 |
 | 1 | (3,3) | 无 | 1 | -1 |
 | 2 | (3,4) | (2,3) | 2 | 0 |
 | 3 | (4,5) | (3,4) | 3 | 2 |
 | 4 | (5,6) | (4,5) | 4 | 3 |

 重建给出：```
1 -> 2 -> 3 -> 5
```该迹线显示了相等的宽度如何防止转换。 信封`(3,3)`不能先于`(3,4)`因为宽度必须严格增加。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | O(n^2) | O(n^2) | 每个信封都会检查所有之前的信封 |
 | 空间| O(n) | DP 和父数组为每个信封存储一个值 |

 和`n ≤ 5000`，二次 DP 在最坏的情况下执行大约 2500 万次比较。 当使用快速输入迭代实现时，这完全符合 Python 的时间限制。 

## 测试用例```python
# helper: run solution on input string, return output string
import sys
import io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)

    input = sys.stdin.readline

    def solve():
        n, w, h = map(int, input().split())

        envelopes = []

        for i in range(1, n + 1):
            x, y = map(int, input().split())

            if x > w and y > h:
                envelopes.append((x, y, i))

        if not envelopes:
            return "0"

        envelopes.sort()

        m = len(envelopes)

        dp = [1] * m
        parent = [-1] * m

        best_len = 1
        best_idx = 0

        for i in range(m):
            wi, hi, _ = envelopes[i]

            for j in range(i):
                wj, hj, _ = envelopes[j]

                if wj < wi and hj < hi:
                    if dp[j] + 1 > dp[i]:
                        dp[i] = dp[j] + 1
                        parent[i] = j

            if dp[i] > best_len:
                best_len = dp[i]
                best_idx = i

        path = []

        cur = best_idx

        while cur != -1:
            path.append(envelopes[cur][2])
            cur = parent[cur]

        path.reverse()

        return str(best_len) + "\n" + " ".join(map(str, path))

    return solve().strip()

# provided sample
assert run(
"""2 1 1
2 2
2 2
"""
) in ["1\n1", "1\n2"], "sample 1"

# no envelope fits
assert run(
"""2 5 5
5 6
6 5
"""
) == "0", "strict inequality"

# simple increasing chain
assert run(
"""3 1 1
2 2
3 3
4 4
"""
) == "3\n1 2 3", "basic chain"

# equal widths block transitions
assert run(
"""4 1 1
2 2
2 3
2 4
3 5
"""
) in ["2\n1 4", "2\n2 4", "2\n3 4"], "equal widths"

# single envelope
assert run(
"""1 1 1
2 2
"""
) == "1\n1", "minimum valid case"
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 | 没有适合的信封 |`0`| 明信片尺寸的严格不平等|
 | 严格增加信封| 全链条长度| 基本 DP 正确性 |
 | 等宽| 链条不能使用等宽| 正确的转换条件 |
 | 单一有效信封 | 长度`1`| 最小非空情况 |

 ## 边缘情况

 考虑信封共享尺寸的情况。 

输入：```
3 1 1
2 2
2 2
3 3
```排序后：```
(2,2), (2,2), (3,3)
```处理第二个时`(2,2)`，条件：```
2 < 2
```失败，因此不会发生任何转换。 两个副本都保持长度链`1`。 然后`(3,3)`可以延伸其中任何一个，产生最终的长度链`2`。 

现在考虑仅部分超出明信片尺寸的信封。 

输入：```
3 2 2
3 2
2 3
4 4
```过滤去除`(3,2)`因为高度并不严格大于`2`，并删除`(2,3)`因为宽度并不严格大于`2`。 

仅有的`(4,4)`仍然存在，所以答案是：```
1
3
```最后，考虑完全不可能的情况。 

输入：```
2 5 5
5 6
6 5
```第一个信封失败，因为宽度等于明信片宽度。 第二个失败，因为高度等于明信片的高度。 过滤后的列表立即变空，算法打印：```
0
```这种早期过滤可以防止无效链进入 DP 阶段。
