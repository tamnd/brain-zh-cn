---
title: "CF 105400H - 海盗的战利品"
description: "我们有一排船，每艘船的行为就像一个集装箱，具有固定的最大板条箱槽数。 最初所有的船都是空的。 随着时间的推移，板条箱会被倒入选定的船舶索引中。"
date: "2026-06-22T12:44:13+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 105400
codeforces_index: "H"
codeforces_contest_name: "Fall 2024 Cupertino Informatics Tournament"
rating: 0
weight: 105400
solve_time_s: 129
verified: false
draft: false
---

[CF 105400H - 海盗的战利品](https://codeforces.com/problemset/problem/105400/H)

 **评级：** -
 **标签：** -
 **求解时间：** 2m 9s
 **已验证：** 否

 ## 解决方案
 ## 问题理解

 我们有一排船，每艘船的行为就像一个集装箱，具有固定的最大板条箱槽数。 最初所有的船都是空的。 随着时间的推移，板条箱会被倒入选定的船舶索引中。 如果那艘船已经满了，溢出会继续到下一艘船，依此类推，直到所有板条箱都被放置或者我们跑过最后一艘船，在这种情况下，剩余的板条箱将被丢弃。 

第二种类型的查询询问在处理所有先前的负载之后，当时特定船舶中存储的板条箱的当前数量。 

因此，系统是一个具有容量的动态一维管道，其中每次更新都是“向前推进直到找到空间”操作，并且每次查询都是点检查。 

这些限制使我们远离任何简单的模拟。 对于多达 100,000 艘船舶和 100,000 次操作，针对每个负载逐艘向前推进的直接方法可能会退化为二次行为。 在最坏的情况下，每个负载从船舶 1 开始，几乎传播到船舶 N，产生大约 10^10 个原始操作，这远远超出了 2 秒的限制。 

部分填充中出现了一个更微妙的问题。 一艘船可能会在不同的装载操作中被多次访问，每次只接收少量的板条箱，直到最终装满。 任何一个一个地处理 crate 或在没有聚合的情况下增量更新容量的解决方案都会默默地超时，即使逻辑上是正确的。 

值得明确考虑的边缘情况包括一开始的一系列完全饱和的船舶，其中负载立即向前跳跃，例如：

 输入：```
5 1
0 0 10 10 10
1 1 7
```这里，船舶 1 和 2 已经满了或者实际上无法使用，因此必须从船舶 3 开始加载。如果无法有效地跳过，则会浪费时间重复检查船舶 1 和 2。 

另一个边缘情况是重复的小负载：```
3 3
5 5 5
1 1 1
1 1 1
1 1 1
```尽管每个操作都很小，但任何逐个重新分配箱子的方法都会变得太慢，因为它会在相同的索引上重复工作。 

## 方法

 暴力模拟很简单。 对于每个负载操作，我们从给定的船舶索引开始并向前移动。 在每艘船上，我们都会尽可能多地装载板条箱，直到其剩余容量为止，从传入的数量中减去，并在需要时继续到下一艘船。 这是正确的，因为它完全遵循溢出传播的规则。 

问题是这种扫描可以多次重新访问船舶的长前缀。 如果每个操作都在前面开始，则每次更新都可能需要 O(N) 时间，在最坏的情况下会导致 O(NM) 行为。 

关键的结构观察是，船舶只有在达到满载容量后才变得“无关紧要”。 在那一刻之后，除了作为跳跃点之外，它不再对未来的分配做出贡献。 这意味着活跃的有用头寸只会随着时间的推移而减少。 如果我们能够有效地跳过满船，则每艘船都可以被消除一次，这表明不相交集并集样式的“下一个活动位置”结构或支持快速“查找第一个非满”查询的线段树。 

我们维持每艘船的剩余运力。 对于每个负载，我们不是扫描每个索引，而是重复跳转到起始位置或起始位置之后仍具有剩余容量的下一艘船。 然后我们尽可能地投入其中。 如果它已满，我们将其标记为非活动状态，以便将来的跳转完全跳过它。 

这减少了对满船的重复扫描，并将问题转化为一系列跳转和更新。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 暴力模拟| O(NM) | O(N) | 太慢了 |
 | 线段树/DSU 跳转 | O((N + M) log N) | O((N + M) log N) | O(N) | 已接受 |

 ## 算法演练

 我们存储一个数组`rem[i] = G[i]`，代表每艘船的剩余容量。 我们还维护一个数据结构，可以快速找到处于或超出仍具有正剩余容量的位置的第一个索引。 存储范围内最大剩余容量的线段树足以满足此目的。 

对于从船上开始的每次装载操作`K`和`C`板条箱，我们反复找到下一艘可用的船并将板条箱分发到那里，直到板条箱耗尽或没有可用的船剩余。 

1. 初始化`i`作为以下位置或之后的第一个索引`K`在哪里`rem[i] > 0`。 这是使用线段树“第一个真”查询条件找到的`rem[i] > 0`。 此步骤是必要的，因为许多船只可能已经满了，应该完全跳过。 
2. 虽然`i`存在并且`C > 0`，计算船上可以放置多少个板条箱`i`作为`x = min(rem[i], C)`。 然后我们减去`x`来自两者`rem[i]`和`C`。 
3.如果`rem[i]`在这个操作之后变为零，我们更新线段树，使得这个位置被标记为非活动的。 这确保了未来的搜索将完全跳过这艘船。 
4.如果`rem[i]`仍然是积极的，但是`C`为零，则操作立即结束。 我们不会手动前进，因为不再分发更多的板条箱。 
5. 否则，如果`C`仍然为正并且当前船舶已满，我们再次查询下一艘可用船舶的时间或之后`i + 1`。 

重要的结构思想是，只有当船完全饱和时才会发生运动。 部分填充不会触发移动； 它们只会减少剩余容量。 

### 为什么它有效

 在任何时间点，每艘船都有明确的剩余容量，并且板条箱总是严格从左到右流动，而不会跳过仍然有空间的船。 线段树始终返回所需后缀中具有可用容量的最早的船舶，因此每个放置步骤都遵循原始的贪心规则。 

由于船舶只有在容量达到零时才会被排除在考虑范围之外，而且一旦被移除，它们就不会再次活跃，因此每次移除都是永久性的。 这保证了搜索结构仅单调收缩，防止重复不必要的扫描。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

class SegTree:
    def __init__(self, arr):
        self.n = len(arr)
        self.t = [0] * (4 * self.n)
        self.build(1, 0, self.n - 1, arr)

    def build(self, v, l, r, arr):
        if l == r:
            self.t[v] = arr[l]
            return
        m = (l + r) // 2
        self.build(v * 2, l, m, arr)
        self.build(v * 2 + 1, m + 1, r, arr)
        self.t[v] = max(self.t[v * 2], self.t[v * 2 + 1])

    def update(self, v, l, r, idx, val):
        if l == r:
            self.t[v] = val
            return
        m = (l + r) // 2
        if idx <= m:
            self.update(v * 2, l, m, idx, val)
        else:
            self.update(v * 2 + 1, m + 1, r, idx, val)
        self.t[v] = max(self.t[v * 2], self.t[v * 2 + 1])

    def find_first(self, v, l, r, ql, qr):
        if r < ql or l > qr or self.t[v] == 0:
            return -1
        if l == r:
            return l
        m = (l + r) // 2
        res = self.find_first(v * 2, l, m, ql, qr)
        if res != -1:
            return res
        return self.find_first(v * 2 + 1, m + 1, r, ql, qr)

def main():
    n, m = map(int, input().split())
    g = list(map(int, input().split()))
    rem = g[:]
    st = SegTree(rem)

    out = []

    for _ in range(m):
        tmp = list(map(int, input().split()))
        if tmp[0] == 1:
            _, k, c = tmp
            k -= 1
            i = st.find_first(1, 0, n - 1, k, n - 1)
            while i != -1 and c > 0:
                take = min(rem[i], c)
                rem[i] -= take
                c -= take
                st.update(1, 0, n - 1, i, rem[i])
                if rem[i] > 0:
                    break
                i = st.find_first(1, 0, n - 1, i + 1, n - 1)
        else:
            _, k = tmp
            out.append(str(rem[k - 1]))

    print("\n".join(out))

if __name__ == "__main__":
    main()
```线段树有两个作用。 第一个是跟踪一定范围内的最大剩余容量，以便我们可以快速确定是否存在任何可用的船舶。 第二个是将第一个索引定位在仍有容量的后缀中，这对于保留从左到右的顺序至关重要。 

更新操作始终在修改船舶剩余容量后应用。 如果一艘船达到零，它实际上在未来的搜索中变得不可见，因为它的线段树值变为零。 

加载查询内的循环经过精心构造，以便每次迭代要么完全消耗一艘船，要么在没有板条箱剩余时提前退出。 关键是我们从来不是线性扫描；而是线性扫描。 每次跳跃都是对数的。 

## 工作示例

 考虑一个小案例：

 输入：```
4 2
2 3 1 2
1 1 4
2 2
```我们跟踪剩余容量和指针移动。 

| 步骤| 运营| 船舶指数| 雷姆之前 | 采取| 雷姆之后 | 剩余C |
 | --- | --- | --- | --- | --- | --- | --- |
 | 1 | 负载| 1 | 2 | 2 | 0 | 2 |
 | 2 | 负载继续| 2 | 3 | 2 | 1 | 0 |

 第一次查询后，船1已满，船2还剩1艘。 查询 2 询问 Ship 2，该船返回 1。 

该跟踪显示了溢出如何顺利继续，并在传入的板条箱耗尽时准确停止。 

现在考虑跳过满船：

 输入：```
3 2
0 5 5
1 1 3
2 2
```| 步骤| 运营| 船舶指数| 雷姆之前 | 采取| 雷姆之后 | 剩余C |
 | --- | --- | --- | --- | --- | --- | --- |
 | 1 | 加载开始| 2 | 5 | 3 | 2 | 0 |

 船舶 1 被完全跳过，因为它的容量为零。 该算法直接跳转到船 2，说明了为什么需要线段树搜索。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | O((N + M) log N) | O((N + M) log N) | 每个更新和“第一个可用”查询都在线段树上运行 |
 | 空间| O(N) | 存储剩余容量和线段树节点 |

 这些约束允许最多 100,000 次操作，因此每次操作的对数因子完全在限制范围内。 该结构确保没有操作退化为线性扫描。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    input = sys.stdin.readline

    class SegTree:
        def __init__(self, arr):
            self.n = len(arr)
            self.t = [0] * (4 * self.n)
            self.build(1, 0, self.n - 1, arr)

        def build(self, v, l, r, arr):
            if l == r:
                self.t[v] = arr[l]
                return
            m = (l + r) // 2
            self.build(v * 2, l, m, arr)
            self.build(v * 2 + 1, m + 1, r, arr)
            self.t[v] = max(self.t[v * 2], self.t[v * 2 + 1])

        def update(self, v, l, r, idx, val):
            if l == r:
                self.t[v] = val
                return
            m = (l + r) // 2
            if idx <= m:
                self.update(v * 2, l, m, idx, val)
            else:
                self.update(v * 2 + 1, m + 1, r, idx, val)
            self.t[v] = max(self.t[v * 2], self.t[v * 2 + 1])

        def find_first(self, v, l, r, ql, qr):
            if r < ql or l > qr or self.t[v] == 0:
                return -1
            if l == r:
                return l
            m = (l + r) // 2
            res = self.find_first(v * 2, l, m, ql, qr)
            if res != -1:
                return res
            return self.find_first(v * 2 + 1, m + 1, r, ql, qr)

    n, m = map(int, input().split())
    g = list(map(int, input().split()))
    rem = g[:]
    st = SegTree(rem)

    out = []

    for _ in range(m):
        tmp = list(map(int, input().split()))
        if tmp[0] == 1:
            _, k, c = tmp
            k -= 1
            i = st.find_first(1, 0, n - 1, k, n - 1)
            while i != -1 and c > 0:
                take = min(rem[i], c)
                rem[i] -= take
                c -= take
                st.update(1, 0, n - 1, i, rem[i])
                if rem[i] > 0:
                    break
                i = st.find_first(1, 0, n - 1, i + 1, n - 1)
        else:
            _, k = tmp
            out.append(str(rem[k - 1]))

    return "\n".join(out)

# provided samples (formatted from statement)
# assert run(...) == ...

# custom cases
assert run("""1 1
10
2 1
""") == "10", "single ship query"

assert run("""3 1
1 1 1
1 1 10
""") == "", "overflow discard"

assert run("""3 2
0 5 5
1 1 3
2 2
""") == "2", "skip empty prefix"

assert run("""5 4
2 3 1 4 2
1 2 5
1 1 3
1 1 2
2 3
""") == "1", "mixed operations"
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 | 单船查询 | 10 | 10 基本查询正确性 |
 | 溢出丢弃| （空）| 丢弃超过最后一艘船|
 | 跳过空前缀 | 2 | 跳过零运力船舶|
 | 混合经营| 1 | 交错下的正确性|

 ## 边缘情况

 一个关键的边缘情况是当起始船已经满员时。 在这种情况下，第一个线段树查询会立即跳转到下一个可用的船，并且不会错误地尝试写入已满的槽。 该结构保证满船永远不会作为有效候选者返回，因为它们的存储值为零。 

另一个边缘情况是最后一艘船完全溢出。 当线段树搜索没有返回有效索引时，算法立即停止并丢弃剩余的 crate。 这符合多余的板条箱落入海洋的规则。 

最后一个微妙的情况是在多次操作中重复对同一艘船进行部分填充。 线段树始终反映当前的剩余容量，因此每次重新访问船舶时，仅使用当前可用的空间。 一旦达到零，它就会被永久地从考虑中删除，确保它永远不会再次被错误地选择。
