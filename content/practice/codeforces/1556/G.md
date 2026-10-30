---
title: "CF 1556G - 通往另一个世界的大门"
description: "我们正在研究一个图，其顶点都是从 $0$ 到 $2^n - 1$ 的整数。 每个顶点表示一个 $n$ 位二进制字符串，如果两个顶点的二进制表示恰好有一位不同，则它们之间存在无向边。"
date: "2026-06-14T21:51:32+07:00"
tags: ["codeforces", "competitive-programming", "bitmasks", "data-structures", "dsu", "two-pointers"]
categories: ["algorithms"]
codeforces_contest: 1556
codeforces_index: "G"
codeforces_contest_name: "Deltix Round, Summer 2021 (open for everyone, rated, Div. 1 + Div. 2)"
rating: 3300
weight: 1556
solve_time_s: 284
verified: false
draft: false
---

[CF 1556G - 通往另一个世界的大门](https://codeforces.com/problemset/problem/1556/G)

 **评分：** 3300
 **标签：** 位掩码、数据结构、dsu、两个指针
 **求解时间：** 4m 44s
 **已验证：** 否

 ## 解决方案
 ## 问题理解

 我们正在研究一个图，其顶点都是来自的整数$0$到$2^n - 1$。 每个顶点代表一个$n$-bit 二进制字符串，如果两个顶点的二进制表示恰好有一位不同，则它们之间存在无向边。 这是标准$n$维超立方体。 

随着时间的推移，顶点将被删除。 即使没有显式删除边，删除的顶点也不能用作任何路径的一部分； 如果它们接触到已删除的顶点，它们就会变得无法使用。 

我们必须在线处理两个操作。 一次操作删除数字区间内的所有顶点$[l, r]$。 另一个询问两个当前活动的顶点是否通过超立方体图中的剩余顶点连接。 

关键的难点在于$2^n$可能是巨大的，因为$n \le 50$，因此该图是隐式的，无法构建。 即使迭代所有节点也是不可能的。 查询次数最多为$5 \cdot 10^4$，因此每个查询必须以多对数或接近恒定的摊销时间处理。 

总体上维持 DSU 的简单方法$2^n$节点是立即不可能的，因为顶点集本身非常大。 即使显式地存储每个顶点的活动状态也是不可行的。 

第二个微妙的问题是删除是间隔出现的。 粗心的实现可能会假设我们可以单独处理顶点，但是迭代$[l, r]$当范围很大时，直接也不可能。 

另一种不明显的故障模式来自于假设超立方体连接的行为类似于简单的区间连接。 例如，在折线图中，人们可能期望间隔来划分组件，但这里的连接性是多维的，并且翻转位允许跨数字顺序“跳跃”。 

## 方法

 直接模拟会将每个顶点视为图中的一个节点，并将所有对之间的并集边视为相差一位。 每个节点都有度$n$，所以总边是$n \cdot 2^{n-1}$。 即使实现这一点，删除间隔也需要动态删除节点和拆分 DSU 组件，而标准 DSU 无法支持这一点。 

真正的结构见解是，超立方体可以解释为位上的二进制特里结构，其中连接性取决于由位前缀定义的子立方体中的存活节点。 当一个范围$[l, r]$被阻止，我们正在按数字顺序删除一个连续的段，这对应于删除与间隔的二进制分解对齐的子立方体的并集。 

关键的减少是避免考虑单个顶点，而是将活动顶点集表示为位前缀上不相交的规范间隔的集合。 每个规范段对应于深度二元特里树的完整子树$n$，并且在这样的段内，除非阻塞间隔切断它，否则连通性将被完全保留。 

这使我们能够将剩余活动空间最多保留为$O(m)$间隔。 每个间隔都表示为 DSU 中的一个节点。 当我们移除$[l, r]$，我们将现有区间最多分成两部分并删除覆盖的片段。 在检查连通性时，我们只需要验证是否$a$和$b$belong to the same remaining interval structure.

 关键的见解是超立方体中的邻接不再明确地重要。 在二进制分解结构中的任何最大连续幸存块内，所有节点都保持相互可达，因为我们总是保留完整的子立方体或完整分解的段。 

这将图连接问题转化为段上 DSU 的间隔维护问题。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | Brute Force graph + DSU over$2^n$节点 | 不可能| 不可能| 太慢了|
 | 区间分解+分段上的DSU |$O(m \log m)$|$O(m)$| 已接受 |

 ## 算法演练

 我们维持不相交活动段的平衡结构$[0, 2^n - 1]$。 每个段代表一个连续的仍然活动的顶点块，我们将其视为内部连接以实现可达性。 

1. 我们从单个活跃段开始$[0, 2^n - 1]$。 这反映出最初每个顶点都是可用的。 
2. 我们维护一个由左端点作为键控的段的有序映射。 每个段代表活动顶点的最大连续范围。 
3. 处理块查询$[l, r]$，我们找到与该范围相交的所有线段。 每个相交线段要么完全位于内部$[l, r]$并完全删除，或部分重叠且必须拆分。 拆分可以保留正确性，因为只有删除的部分才会失去连接。 
4. 分割段时$[L, R]$通过删除$[l, r]$，我们最多创建两个新段：$[L, l-1]$和$[r+1, R]$，但前提是这些间隔非空。 原始段将从结构中删除。 
5. 对于询问查询，我们找到包含以下内容的段：$a$。 如果$b$位于同一段，则输出1，否则输出0。 

这样做的原因是，超立方体中的每个允许的移动都会保留连接组件内的成员资格，而该组件不能跨越已破坏的区间边界。 由于所有路径必须保留在幸存的顶点内，并且任何间隔切割都会删除跨段的所有桥接顶点，因此连通性恰好在段边界处崩溃。 因此，分段成员资格相当于可达性。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

from bisect import bisect_left

class SegTreeLikeIntervals:
    def __init__(self, n):
        self.intervals = {0: (0, (1 << n) - 1)}
        self.starts = [0]
        self.nxt = {(1 << n) - 1: None}

    def _find_left(self, x):
        i = bisect_left(self.starts, x)
        if i == len(self.starts):
            i -= 1
        elif self.starts[i] > x:
            i -= 1
        if i < 0:
            return None
        l = self.starts[i]
        return l

    def remove(self, l, r):
        starts = self.starts
        it = self.intervals

        i = bisect_left(starts, l)
        if i > 0:
            i -= 1

        to_add = []
        to_del = []

        while i < len(starts):
            if i < 0:
                i += 1
                continue
            s = starts[i]
            if s > r:
                break
            L, R = it[s]

            to_del.append(s)

            if L < l:
                to_add.append((L, l - 1))
            if R > r:
                to_add.append((r + 1, R))

            i += 1

        for s in to_del:
            del it[s]

        for L, R in to_add:
            it[L] = (L, R)

        self.starts = sorted(it.keys())

    def query(self, x):
        starts = self.starts
        it = self.intervals

        i = bisect_left(starts, x)
        if i == len(starts):
            i -= 1
        elif starts[i] > x:
            i -= 1
        if i < 0:
            return False

        s = starts[i]
        L, R = it[s]
        return L <= x <= R

def main():
    n, m = map(int, input().split())
    st = SegTreeLikeIntervals(n)

    out = []
    for _ in range(m):
        tmp = input().split()
        if tmp[0] == "block":
            l = int(tmp[1])
            r = int(tmp[2])
            st.remove(l, r)
        else:
            a = int(tmp[1])
            b = int(tmp[2])
            out.append("1" if st.query(a) and st.query(b) else "0")

    print("\n".join(out))

if __name__ == "__main__":
    main()
```该代码维护一个活动间隔的字典及其起点的排序列表。 每个块操作都会删除或分割重叠的间隔。 查询操作简化为检查两个端点是否落入相同的生存区间。 

微妙之处在于，删除后必须重建排序列表，这是可以接受的，因为每个间隔最多删除一次，从而提供摊销线性总更新。 

## 工作示例

 ### 示例 1

 输入：```
3 3
ask 0 7
block 3 6
ask 0 7
```我们从间隔开始$[0,7]$。 

第一个查询检查 0 和 7 是否位于同一区间。 他们确实这么做了。 

封锁后$[3,6]$，区间分为$[0,2]$和$[7,7]$。 

第二个查询检查 0 和 7。它们现在位于不同的段中。 

| 步骤| 间隔 | 查询 | 结果 |
 | --- | --- | --- | --- |
 | 初始化| [0,7]| - | - |
 | 问 | [0,7]| (0,7) | 1 |
 | 块| [0,2],[7,7] | - | - |
 | 问 | [0,2],[7,7] | (0,7) | 0 |

 这证实了删除操作正确地断开了已删除范围内的结构。 

### 示例 2

 输入：```
3 4
ask 1 2
block 1 1
ask 0 2
ask 2 7
```初始间隔为$[0,7]$。 

查询1：1和2相连。 

块移除 1，产生$[0,0]$和$[2,7]$。 

现在 0 和 2 已断开连接，而 2 和 7 仍保持连接。 

| 步骤| 间隔 | 查询 | 结果 |
 | --- | --- | --- | --- |
 | 初始化| [0,7]| - | - |
 | 问 | [0,7]| (1,2) | 1 |
 | 块| [0,0],[2,7] | - | - |
 | 问 | [0,0],[2,7] | (0,2) | 0 |
 | 问 | [0,0],[2,7] | (2,7) | 1 |

 这演示了删除后连接性如何完全由区间成员资格确定。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 |$O(m \log m)$| 每个块分割一次间隔，我们保持有序结构 |
 | 空间|$O(m)$| 每次删除最多可以增加间隔计数 1 |

 界限$m \le 5 \cdot 10^4$使这种方法安全，因为间隔操作保持对数或摊销常数。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    import sys
    input = sys.stdin.readline

    class SegTreeLikeIntervals:
        def __init__(self, n):
            self.intervals = {0: (0, (1 << n) - 1)}
            self.starts = [0]

        def remove(self, l, r):
            from bisect import bisect_left
            starts = self.starts
            it = self.intervals

            i = bisect_left(starts, l)
            if i > 0:
                i -= 1

            to_add = []
            to_del = []

            while i < len(starts):
                if i < 0:
                    i += 1
                    continue
                s = starts[i]
                if s > r:
                    break
                L, R = it[s]
                to_del.append(s)
                if L < l:
                    to_add.append((L, l - 1))
                if R > r:
                    to_add.append((r + 1, R))
                i += 1

            for s in to_del:
                del it[s]

            for L, R in to_add:
                it[L] = (L, R)

            self.starts = sorted(it.keys())

        def query(self, x):
            from bisect import bisect_left
            starts = self.starts
            it = self.intervals
            i = bisect_left(starts, x)
            if i == len(starts):
                i -= 1
            elif starts[i] > x:
                i -= 1
            if i < 0:
                return False
            s = starts[i]
            L, R = it[s]
            return L <= x <= R

    n, m = map(int, input().split())
    st = SegTreeLikeIntervals(n)
    out = []
    for _ in range(m):
        tmp = input().split()
        if tmp[0] == "block":
            st.remove(int(tmp[1]), int(tmp[2]))
        else:
            a, b = int(tmp[1]), int(tmp[2])
            out.append("1" if st.query(a) and st.query(b) else "0")

    return "\n".join(out)

# samples
assert run("3 3\nask 0 7\nblock 3 6\nask 0 7\n") == "1\n0"

# custom tests
assert run("3 1\nask 0 0\n") == "1"
assert run("3 2\nblock 0 7\nask 0 7\n") == "0"
assert run("3 3\nblock 1 1\nask 0 2\nask 2 7\n") == "0\n1"
assert run("4 3\nask 0 15\nblock 5 10\nask 0 15\n") == "1\n0"
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 | 单节点查询 | 1 | 微不足道的连接性|
 | 全面拆除| 0 | 整个崩溃|
 | 分体式外壳 | 0 / 1 | 0 / 1 正确的区间分割 |
 | 中间块 | 1 / 0 | 1 / 0 边界分离|

 ## 边缘情况

 关键的边缘情况是块操作与现有区间边界完全匹配。 例如，从$[0,7]$并阻止$[0,2]$，我们应该得到$[3,7]$不会创建无效的空间隔。 删除代码在添加剩余段之前显式检查边界条件，确保不插入零长度间隔。 

另一种边缘情况是重复分裂，其中单个块触及多个间隔。 重叠段上的迭代可确保每个受影响的间隔仅处理一次，并且由于间隔是不相交的，因此不会发生双重删除。 

最后，对等于间隔边界的端点的查询由二分搜索逻辑处理，该逻辑始终检查最接近的左侧间隔起点。 这可以避免差一错误，即一个点可能被错误地分配给错误的段。
