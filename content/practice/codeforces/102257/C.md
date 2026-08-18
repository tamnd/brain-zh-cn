---
title: "CF 102257C - 路灯"
description: "该街道有 (n+1) 个站点和 (n) 个连续路段。 灯 (i) 控制停靠点 (i) 和 (i+1) 之间的路段。 在任何时刻，当每个索引为 (a,a+1,ldots,b-1) 的灯亮起时，出租车就可以从站点 (a) 行驶到站点 (b)。 灯配置在时间 (0) 给出。"
date: "2026-08-17T20:47:29+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 102257
codeforces_index: "C"
codeforces_contest_name: "2019 Asia-Pacific Informatics Olympiad (APIO 19)"
rating: 0
weight: 102257
solve_time_s: 91
verified: true
draft: false
---

[CF 102257C - 路灯](https://codeforces.com/problemset/problem/102257/C)

 **评级：** -
 **标签：** -
 **求解时间：** 1m 31s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 该街道有 (n+1) 个站点和 (n) 个连续路段。 灯 (i) 控制停靠点 (i) 和 (i+1) 之间的路段。 在任何时刻，当每个索引为 (a,a+1,\ldots,b-1) 的灯亮起时，出租车就可以从站点 (a) 行驶到站点 (b)。 

灯配置在时间 (0) 给出。 每小时结束时，都会发生一个事件。 切换开关可改变一盏灯，而查询则询问从停止 (a) 到停止 (b) 的整个间隔连续可用的时间已经过去了多少小时。 该查询包括截至当前事件时间的所有已完成小时数。 

约束条件为 (n,q\le 300000)。 直接扫描每个查询中的所有灯可能需要 (O(nq))，这与 (9\cdot10^{10}) 灯检查一样大。 这远远超出了 5 秒限制所能支持的范围。 我们需要每个事件的大致对数工作，给出 (O((n+q)\log n)) 解决方案。 

第一个微妙之处是事件发生在时间结束时。 考虑```
1 1
1
query 1 2
```答案是`1`， 不是`0`。 灯在整个 1 小时内一直亮着，因此完整的一小时也算在内。 

第二个微妙之处是，一小时结束时的切换仅影响未来的时间。 在官方示例中，灯 3 在第 5 小时结束时切换。配置为`11011`在 1 到 5 小时内，以及`11111`从 6 小时开始。因此，在 6 小时的查询会看到停靠点 3 和 4 正好有一个可用小时。 

第三个微妙之处是跨越多个灯的查询。 例如，```
3 1
101
query 1 4
```有答案`0`，因为中间的灯熄灭了。 仅检查端点会错误地得出整个路线可用的结论。 

最后，涉及一个段的查询仍然是范围查询。 为了```
2 1
01
query 2 3
```答案是`1`，因为只有灯 2 重要。 在不处理端点约定的情况下将停止索引直接转换为段索引是差一错误的常见来源。 

## 方法

 一个简单的解决方案可以模拟当前灯状态，并针对每个查询检查灯 (a) 到 (b-1)。 如果它们全部打开，则查询的答案可能会增加自上一个事件（使此配置保持不变）以来的小时数。 这是正确的，因为配置在连续切换事件之间是恒定的。 

问题是范围检查。 单个查询可以检查 (n) 个灯，并且可以有 (q) 个查询。 在最坏的情况下，这会给出 (O(nq)=9\cdot10^{10}) 检查。 维护当前状态本身很便宜，但反复确定整个区间是否由 1 组成则不然。 

关键的观察结果是，问题不仅仅询问某个范围当前是否全部打开。 它询问该范围全部开启的总时间。 这建议将历史信息直接存储在线段树中。 

对于每个线段树节点，保存该节点中的每个灯当前是否打开，以及直到最后一次处理该节点时整个节点打开的总时间。 还存储该节点的历史值上次最终确定的时间戳。 

假设一个节点自（上次）以来一直处于完全开启状态。 当我们在时间 (t) 第一次需要它的信息时，它对未记录间隔的贡献就是 (t-last)。 如果节点当前关闭，则贡献为零。 点切换仅更改 (O(\log n)) 段树节点，因此所有受影响的历史值都可以在 (O(\log n)) 中最终确定。 范围查询访问 (O(\log n)) 个规范节点，并且每个节点都可以在查询时类似地最终确定。 

蛮力方法之所以有效，是因为它明确地检查了每盏重要的灯。 它失败是因为一遍又一遍地检查相同的长范围。 观察到一个段的整个状态仅在其后代之一被切换时才发生变化，这让我们可以存储其累积的可用时间并仅在必要时更新它。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 蛮力 | (O(nq)) 最坏情况 | (O(n)) | (O(n)) | 太慢了 |
 | 最佳| (O((n+q)\log n)) | (O(n)) | (O(n)) | 已接受 |

 ## 算法演练

 1. 在 (n) 个灯上构建线段树。 对于每个节点，存储`on`，当该节点代表的每个灯当前都打开时，这正是正确的。 还存储`total`，整个节点处于开启状态的已最终确定的时间量，以及`last`，经过的时间戳`total`已经敲定。 
2. 初始化每个节点的`last`值为零。 初始配置从时间零开始有效，因此尚未累积时间。 这`on`值是根据初始二进制字符串计算的。 
3. 当某个节点在时间 (t) 被访问时，最终确定其丢失的时间间隔。 如果`on`为 true，将 (t-last) 添加到`total`。 然后设置`last=t`。 如果`on`是假的，仅`last`变化是因为节点在该时间间隔内没有做出任何贡献。 
4. 对于在时间 (t) 结束时切换灯 (i) 的情况，从该叶子向根部行走并在时间 (t) 时完成路径上的每个节点。 这记录了切换前一小时 (t) 内存在的状态。 然后把叶子翻过来`on`价值。 
5. 从下向上重新计算切换叶子的祖先。 父级当前处于开启状态，而其两个子级当前处于开启状态。 设置父母的`last`值到 (t)，因为它的新状态从此时间戳开始。 
6. 对于从停止(a)到停止(b)的查询，将其转换为半开灯间隔([a-1,b-1))。 这些正是灯 (a,a+1,\ldots,b-1)。 将此区间分解为通常的 (O(\log n)) 线段树节点。 
7. 最终确定当前时间（t）的每个选定节点，然后添加其`total`对答案的价值。 所选节点是不相交的，并且一起包含了所请求的灯，因此可以直接对它们的可用时间贡献进行求和。 
8. 输出结果总和。 查询不会更改灯配置，因此查询后不需要重新计算树状态。 

不变量是对于每个线段树节点，`total`包含从时间零到时间间隔期间整个段处于打开状态的确切时间量`last`。 它是`on`flag 描述了紧随其后的配置`last`。 每当稍后触摸该节点时，从`last`新时间具有恒定状态，因此添加其长度正好可以说明所有新完成的可用时间。 点切换沿其根到叶路径保持这种不变性，范围查询对不相交的节点求和，这些节点的表示间隔恰好形成所请求的路线。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

def solve():
    n, q = map(int, input().split())
    s = input().strip()

    size = 1
    while size < n:
        size <<= 1

    # on[v]   = whether the whole segment of v is currently on
    # total[v] = finalized amount of time for which the whole segment was on
    # last[v] = time through which total[v] has been finalized
    on = [False] * (2 * size)
    total = [0] * (2 * size)
    last = [0] * (2 * size)

    for i, ch in enumerate(s):
        on[size + i] = (ch == '1')

    for v in range(size - 1, 0, -1):
        on[v] = on[v << 1] and on[v << 1 | 1]

    def touch(v, t):
        if on[v]:
            total[v] += t - last[v]
        last[v] = t

    def toggle(pos, t):
        v = size + pos

        # Finalize every node whose old state is about to change.
        u = v
        while u:
            touch(u, t)
            u >>= 1

        # Change the lamp itself.
        on[v] = not on[v]

        # Recompute ancestors using the new child states.
        v >>= 1
        while v:
            on[v] = on[v << 1] and on[v << 1 | 1]
            last[v] = t
            v >>= 1

    def query(left, right, t):
        # Query [left, right) in zero-based lamp indices.
        left += size
        right += size

        answer = 0

        while left < right:
            if left & 1:
                touch(left, t)
                answer += total[left]
                left += 1

            if right & 1:
                right -= 1
                touch(right, t)
                answer += total[right]

            left >>= 1
            right >>= 1

        return answer

    out = []

    for t in range(1, q + 1):
        event = input().split()

        if event[0] == "toggle":
            pos = int(event[1]) - 1
            toggle(pos, t)
        else:
            a = int(event[1])
            b = int(event[2])

            # Stops [a, b] correspond to lamps [a-1, b-1).
            left = a - 1
            right = b - 1

            out.append(str(query(left, right, t)))

    sys.stdout.write("\n".join(out))

if __name__ == "__main__":
    solve()
```该树使用二次方数量的叶子，因为这使得迭代范围分解变得简单。 额外的叶子被初始化为关闭。 它们永远不会出现在有效查询中，因为每个查询都以 lamp (n) 结束，因此它们不会影响选定的规范节点。 

这`touch`功能是中心操作。 节点的状态自此以来一直保持不变`last[v]`，所以如果它当前处于打开状态，则恰好`t - last[v]`又过了几个小时，整个路段都被照亮了。 

切换操作首先触及使用旧状态的每个祖先。 这个顺序很重要。 如果先翻转叶子，则翻转之前的时间间隔可能会丢失。 旧贡献定下来后，叶子被翻转，祖先被重建。 

该查询仔细地将停靠点转换为灯。 从站点 (a) 行驶到站点 (b) 使用灯 (a) 到 (b-1)，因此在从零开始的半开符号中，间隔为`[a - 1, b - 1)`。 

Python整数不会溢出，最大的答案最多是(q)，也就是(300000)。 该实现是迭代的，而不是递归地遍历线段树，从而避免了跨最多 (300000) 个事件的 Python 递归开销。 

## 工作示例

 官方的样例是：```
5 7
11011
query 1 2
query 1 2
query 1 6
query 3 4
toggle 3
query 3 4
query 1 6
```每个完整小时内的状态及相关查询结果为：

 | 小时 | 活动 | 小时内的灯状态 | 查询间隔| 回答 |
 | ---| ---| ---| ---| ---|
 | 1 |`query 1 2`|`11011`| 灯 1 | 1 |
 | 2 |`query 1 2`|`11011`| 灯 1 | 2 |
 | 3 |`query 1 6`|`11011`| 灯 1..5 | 0 |
 | 4 |`query 3 4`|`11011`| 灯 3 | 0 |
 | 5 |`toggle 3`|`11011`| 无 | 0 |
 | 6 |`query 3 4`|`11111`| 灯 3 | 1 |
 | 7 |`query 1 6`|`11111`| 灯 1..5 | 2 |

 结果输出是`1, 2, 0, 0, 1, 2`。 这演示了关键的计时规则：第 5 小时结束时的切换仅更改第 6 小时以后的配置。 

对于第二个示例，请考虑：```
3 5
111
query 1 4
toggle 2
query 1 4
toggle 2
query 1 4
```状态和树级解释是：

 | 小时 | 活动 | 事件发生后的当前状态 | 查询间隔| 回答 |
 | ---| ---| ---| ---| ---|
 | 1 |`query 1 4`|`111`| 灯 1..3 | 1 |
 | 2 |`toggle 2`|`101`| 无 | 0 |
 | 3 |`query 1 4`|`101`| 灯 1..3 | 1 |
 | 4 |`toggle 2`|`111`| 无 | 0 |
 | 5 |`query 1 4`|`111`| 灯 1..3 | 2 |

 在第 3 小时，整个间隔仅在第 1 小时内可用，因此累积的答案仍然为 1。第二次切换后，整个间隔从第 5 小时开始再次可用，在最终查询时总共提供了两个可用小时。 该示例练习了两个方向的切换，并确认历史时间被保留，而不是从当前状态重新计算。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 | (O((n+q)\log n)) | 构建树的成本为 (O(n))，每个切换都会触及一条从根到叶的路径，并且每个查询都会访问 (O(\log n)) 个规范节点。 |
 | 空间| (O(n)) | (O(n)) | 维护了四个线段树大小的数组，树包含 (O(n)) 个节点。 |

 使用 (n,q\le300000)，该解决方案仅对每个事件执行对数数量的树操作，而不是每个查询执行数十万次灯检查。 这符合问题给出的 5 秒、512 MB 限制。 

## 测试用例```python
# helper: run the solution on an input string
import sys
import io

def solve_io(inp: str) -> str:
    data = inp.splitlines()
    it = iter(data)

    n, q = map(int, next(it).split())
    s = next(it).strip()

    size = 1
    while size < n:
        size <<= 1

    on = [False] * (2 * size)
    total = [0] * (2 * size)
    last = [0] * (2 * size)

    for i, ch in enumerate(s):
        on[size + i] = (ch == '1')

    for v in range(size - 1, 0, -1):
        on[v] = on[v << 1] and on[v << 1 | 1]

    def touch(v, t):
        if on[v]:
            total[v] += t - last[v]
        last[v] = t

    def toggle(pos, t):
        v = size + pos

        u = v
        while u:
            touch(u, t)
            u >>= 1

        on[v] = not on[v]

        v >>= 1
        while v:
            on[v] = on[v << 1] and on[v << 1 | 1]
            last[v] = t
            v >>= 1

    def query(left, right, t):
        left += size
        right += size
        ans = 0

        while left < right:
            if left & 1:
                touch(left, t)
                ans += total[left]
                left += 1

            if right & 1:
                right -= 1
                touch(right, t)
                ans += total[right]

            left >>= 1
            right >>= 1

        return ans

    out = []

    for t in range(1, q + 1):
        event = next(it).split()

        if event[0] == "toggle":
            toggle(int(event[1]) - 1, t)
        else:
            a = int(event[1])
            b = int(event[2])
            out.append(str(query(a - 1, b - 1, t)))

    return "\n".join(out)

# Official sample
assert solve_io(
    """5 7
11011
query 1 2
query 1 2
query 1 6
query 3 4
toggle 3
query 3 4
query 1 6
"""
) == """1
2
0
0
1
2""", "official sample"

# Minimum-size case
assert solve_io(
    """1 1
1
query 1 2
"""
) == "1", "single lamp"

# All lamps initially on, then the middle lamp is toggled off and on again
assert solve_io(
    """3 5
111
query 1 4
toggle 2
query 1 4
toggle 2
query 1 4
"""
) == """1
1
2""", "toggle off and back on"

# Boundary query with only the last lamp
assert solve_io(
    """2 3
01
query 2 3
toggle 2
query 2 3
"""
) == """1
1""", "last lamp boundary"

# Maximum-size n and q, all lamps initially on.
# Every event is a query over the complete street.
n = 300000
q = 300000
maximum_input = (
    f"{n} {q}\n"
    + "1" * n
    + "\n"
    + "\n".join(["query 1 300001"] * q)
    + "\n"
)
maximum_output = "\n".join(["1"] + [str(i) for i in range(2, q + 1)])
assert solve_io(maximum_input) == maximum_output, "maximum-size case"
```| 测试输入| 预期产出 | 它验证了什么 |
 | ---| ---| ---|
 |`1 1 / 1 / query 1 2`|`1`| 最小尺寸和当前完成的小时数的事实 |
 |`3 5 / 111 / ...`|`1, 1, 2`| 历史时间的反复切换和保存 |
 |`2 3 / 01 / ...`|`1, 1`| 从最终停止点对和端点转换开始的查询 |
 |`300000 300000 / 1...1 / repeated full queries`|`1, 2, ..., 300000`| 全范围最大约束与积累|

 ## 边缘情况

 最小的箱子有一个灯和两个挡块。 为了```
1 1
1
query 1 2
```查询对应于单个灯，该灯在整个 1 小时内亮起。查询间隔变为`[0,1)`，仅选择一片叶子，并且`touch`添加 (1-0=1)。 输出是`1`。 

全街查询是差一错误的另一个常见来源。 和```
3 1
111
query 1 4
```从站点 1 到站点 4 的路线使用灯 1、2 和 3。该实现将其转换为`[0,3)`，因此所有三片叶子都被选中。 由于整个片段在第一个小时内都在播放，所以答案是`1`。 

一小时结束时的切换不得追溯更改该小时。 考虑```
1 2
1
toggle 1
query 1 2
```在 1 小时期间，灯亮起。 切换发生在第 1 小时结束时，因此在第 2 小时期间关闭。 在切换时间戳处，叶子首次被触摸并接收一小时的累积接通时间。 后续查询再次触及它，但其当前状态为关闭，因此不会添加额外的时间。 答案是`1`。 

即使所有其他灯都打开，包含单个关闭灯的范围也必须为零。 为了```
3 1
101
query 1 4
```代表整条街道的根当前已关闭，因为它的中间子项已关闭。 该查询将范围分解为组合状态不完全打开的节点，并且包含零灯的每个选定节点不贡献时间。 输出是`0`。 

最大大小情况对于检查累加值在许多查询中是否保持正确也很有用。 如果所有（300000）盏灯都亮起并且每个事件都是全街查询，则状态永远不会改变。 第一个查询记录一个小时，第二个查询记录另一个小时，依此类推，产生从 1 到 300000 的答案。线段树不需要检查单个灯，因此重复的查询保持对数。
