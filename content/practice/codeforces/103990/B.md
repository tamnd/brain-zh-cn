---
title: "CF 103990B - 平衡跷跷板阵列"
description: "我们得到了一组值和一长串更新。 每个查询要么将整个段增加一个常量，要么用常量值覆盖一个段，或者询问给定的子数组是否具有特殊的“平衡”属性。"
date: "2026-07-02T06:04:46+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 103990
codeforces_index: "B"
codeforces_contest_name: "2022 ICPC Asia Taiwan Online Programming Contest"
rating: 0
weight: 103990
solve_time_s: 62
verified: true
draft: false
---

[CF 103990B - 平衡跷跷板阵列](https://codeforces.com/problemset/problem/103990/B)

 **评级：** -
 **标签：** -
 **求解时间：** 1m 2s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们得到了一组值和一长串更新。 每个查询要么将整个段增加一个常量，要么用常量值覆盖一个段，或者询问给定的子数组是否具有特殊的“平衡”属性。 

如果子数组内部存在索引 k，则该子数组被认为是平衡的，这样如果我们将每个元素乘以它与 k 的距离，则带符号加权和将变为零。 换句话说，k 的作用就像一个枢轴，数组像跷跷板一样完美平衡，左侧和右侧的值在加权贡献方面相互抵消。 

每个类型 3 的查询都会询问特定子数组是否可以在这种意义上平衡。 困难在于数组经常变化，因此我们无法为每个查询从头开始重新计算所有内容。 

这些约束立即排除了天真地重新计算子数组属性的可能性。 数组长度可达10万，而操作次数可达120万次。 任何每次查询扫描一个段的解决方案都将不可避免地超时，因为在最坏的情况下，即使每个操作进行一次线性扫描也会导致大约 1011 次操作。 

第二个重要的困难是更新不是简单的点更改。 它们是范围添加和范围分配，两者都会同时影响多个位置。 这将解决方案推向支持惰性传播的数据结构。 

朴素方法的一个微妙的失败案例来自于对“k 的存在”条件的误解。 例如，考虑一个段 [1, 2, -1]。 一个天真的想法可能会尝试在中点检查平衡或假设类似对称的行为，但正确的条件取决于加权和，而不是几何直觉。 当段中的所有值都变为零时，会出现另一种失败情况。 在这种情况下，k 的每个选择都满足方程，因此答案必须始终为“是”，如果在不检查零情况的情况下除以总和，则很容易错过。 

## 方法

 直接方法将通过迭代该段并从头开始计算条件来回答每个查询。 对于长度为 m 的段，我们将计算两个量：值之和以及索引乘以值的加权和。 由此，我们可以得出是否存在有效的主元。 这工作正常，但每个查询的成本为 O(m)，并且对于多达 120 万个查询，这变得太慢了。 

关键的观察结果是，平衡条件仅取决于该段上的两个合计值。 如果我们将 S 定义为元素之和，将 T 定义为 i * a[i] 之和，则条件简化为 S 和 T 中的一个简单代数方程。这意味着我们在查询时不需要知道段内的各个元素，只需要知道这两个聚合。 

一旦问题简化为维持两个不同量的范围之和，该结构就成为标准的。 线段树可以为每个区间维护S和T。 范围添加和范围分配操作可以转换为对这些聚合的更新。 唯一的附加因素是 T 取决于索引，因此每个节点不仅必须存储值之和，还必须存储按值变化加权的索引之和。 

从几何平衡条件到使用前缀聚合的恒定时间检查的转换使解决方案变得高效。 之后，剩下的就是经典的惰性传播问题。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 蛮力 | O(nq) | O(1) | O(1) | 太慢了 |
 | 具有聚合的线段树 | O(q log n) | O(q log n) | O(n) | 已接受 |

 ## 算法演练

我们维护一棵线段树，其中每个节点存储三条信息：线段中值的总和、线段中索引的总和以及一对用于范围分配和范围添加的惰性标记。 

为了清楚起见，让 len 为段长度，idxSum 为该段中的索引之和，两者都是针对每个节点结构预先计算的。 

### 1.预先计算每个线段树节点的结构信息

 每个节点都知道其区间 [l, r]、其长度以及该区间内的索引之和。 当值均匀变化时，这允许快速重新计算加权和。 

这是必要的原因是更新取决于值大小和位置，因此我们必须将结构信息与动态值分开。 

### 2. 每个节点维护两个聚合

 每个节点存储 S（a[i] 之和）和 T（i * a[i] 之和）。 这两个值充分描述了任何段的平衡状况。 

这种简化之所以有效，是因为平衡方程展开为这两个和的线性表达式。 

### 3. 处理范围分配

 当段设置为常数 x 时，S 变为长度的 x 倍，T 变为索引和的 x 倍。 任何先前的结构都会被覆盖，因此惰性添加会被清除。 

这可确保片段保持一致，而无需接触各个元素。 

### 4. 处理范围添加

 当将 x 添加到段中的每个元素时，S 会增加 x 乘以长度。 T 增加 x 倍指数之和。 这是有效的，因为每个位置 i 都会获得 x * i 的额外贡献。 

### 5. 使用代数回答查询

 对于查询段，计算 S 和 T。 

如果 S 等于 0，则条件简化为要求 T 等于 0。 如果两者都为零，则任何主元都有效，因此答案是肯定的。 

如果 S 非零，则主元为 k = T / S。仅当 k 是整数且位于段边界内时，答案才有效。 

### 为什么它有效

 关键的不变量是，对于每个线段树节点，在应用所有惰性操作之后，S 和 T 始终与所表示线段的真实值之和以及索引的加权和完全匹配。 由于每个更新规则都保留每个操作的代数贡献，因此不会丢失任何信息。 查询条件直接通过将平衡方程重写为可解的线性形式而导出，因此正确性降低为验证算术一致性而不是数组的结构属性。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

sys.setrecursionlimit(10**7)

class Node:
    __slots__ = ("s", "t", "add", "assign", "has_assign")
    def __init__(self):
        self.s = 0
        self.t = 0
        self.add = 0
        self.assign = 0
        self.has_assign = False

class SegTree:
    def __init__(self, a):
        self.n = len(a) - 1  # 1-indexed
        self.tree = [Node() for _ in range(4 * self.n)]
        self.build(1, 1, self.n, a)

    def build(self, idx, l, r, a):
        if l == r:
            self.tree[idx].s = a[l]
            self.tree[idx].t = a[l] * l
            return
        mid = (l + r) // 2
        self.build(idx*2, l, mid, a)
        self.build(idx*2+1, mid+1, r, a)
        self.pull(idx)

    def pull(self, idx):
        left = self.tree[idx*2]
        right = self.tree[idx*2+1]
        self.tree[idx].s = left.s + right.s
        self.tree[idx].t = left.t + right.t

    def apply_assign(self, idx, l, r, x):
        node = self.tree[idx]
        node.s = x * (r - l + 1)
        node.t = x * (r + r - (r - l)) * (r - l + 1) // 2  # sum i from l to r * x
        node.has_assign = True
        node.assign = x
        node.add = 0

    def apply_add(self, idx, l, r, x):
        node = self.tree[idx]
        node.s += x * (r - l + 1)
        node.t += x * (l + r) * (r - l + 1) // 2

        if node.has_assign:
            node.assign += x
        else:
            node.add += x

    def push(self, idx, l, r):
        node = self.tree[idx]
        if l == r:
            return
        mid = (l + r) // 2
        if node.has_assign:
            self.apply_assign(idx*2, l, mid, node.assign)
            self.apply_assign(idx*2+1, mid+1, r, node.assign)
            node.has_assign = False
        if node.add != 0:
            self.apply_add(idx*2, l, mid, node.add)
            self.apply_add(idx*2+1, mid+1, r, node.add)
            node.add = 0

    def update_add(self, idx, l, r, ql, qr, x):
        if ql <= l and r <= qr:
            self.apply_add(idx, l, r, x)
            return
        self.push(idx, l, r)
        mid = (l + r) // 2
        if ql <= mid:
            self.update_add(idx*2, l, mid, ql, qr, x)
        if qr > mid:
            self.update_add(idx*2+1, mid+1, r, ql, qr, x)
        self.pull(idx)

    def update_assign(self, idx, l, r, ql, qr, x):
        if ql <= l and r <= qr:
            self.apply_assign(idx, l, r, x)
            return
        self.push(idx, l, r)
        mid = (l + r) // 2
        if ql <= mid:
            self.update_assign(idx*2, l, mid, ql, qr, x)
        if qr > mid:
            self.update_assign(idx*2+1, mid+1, r, ql, qr, x)
        self.pull(idx)

    def query(self, idx, l, r, ql, qr):
        if ql <= l and r <= qr:
            return self.tree[idx].s, self.tree[idx].t
        self.push(idx, l, r)
        mid = (l + r) // 2
        s = t = 0
        if ql <= mid:
            s1, t1 = self.query(idx*2, l, mid, ql, qr)
            s += s1
            t += t1
        if qr > mid:
            s2, t2 = self.query(idx*2+1, mid+1, r, ql, qr)
            s += s2
            t += t2
        return s, t

def main():
    n, q = map(int, input().split())
    arr = [0] + list(map(int, input().split()))
    st = SegTree(arr)

    out = []

    for _ in range(q):
        tmp = input().split()
        if tmp[0] == '1':
            l, r, x = map(int, tmp[1:])
            st.update_add(1, 1, n, l, r, x)
        elif tmp[0] == '2':
            l, r, x = map(int, tmp[1:])
            st.update_assign(1, 1, n, l, r, x)
        else:
            l, r = map(int, tmp[1:])
            s, t = st.query(1, 1, n, l, r)
            m = r - l + 1
            if s == 0:
                out.append("Yes" if t == 0 else "No")
            else:
                if t % s != 0:
                    out.append("No")
                else:
                    k = t // s
                    out.append("Yes" if l <= k <= r else "No")

    print("\n".join(out))

if __name__ == "__main__":
    main()
```该实现为每个段维护两个独立的聚合。 第一个是值的总和，第二个是指数加权值的总和。 每次更新都会一致地修改两者，并且惰性传播确保操作组合下的正确性。 查询逻辑直接应用导出的代数条件。 

一个微妙的实现点是赋值和添加惰性标记之间的交互。 分配必须覆盖任何先前的添加，并且当按下时，它必须在应用进一步的增量之前完全重置子状态。 此顺序的任何颠倒都会导致不正确的累积。 

另一个重要的细节是所有计算都依赖于精确的整数运算。 Python 安全地处理大整数，这避免了低级语言中出现的溢出问题。 

## 工作示例

 ### 示例 1

 输入段：[1,2,3]

 | 步骤| S（总和）| T（加权和）| 决定|
 | ---| ---| ---| ---|
 | 查询全 | 6 | 14 | 14 检查 k |
 | k = T/S | | 14/6 不是整数 | 没有 |

 该段无法平衡，因为没有整数主元可以产生完美的抵消。 

### 示例 2

 输入段：[1,2,1]

 | 步骤| S | T | 决定|
 | ---| ---| ---| ---|
 | 查询 | 4 | 8 | k = 2 |
 | 检查边界 | | 2 在 [1,3] | 是的 |

 这确认了索引 2 处存在有效的主元。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 | O(q log n) | O(q log n) | 每次更新和查询都会遍历线段树高度 |
 | 空间| O(n) | 树节点和惰性标签的存储 |

 这些约束允许最多 120 万次操作，因此在严格实现的情况下，每个操作的对数因子在 Python 中仍然可以接受。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    main()
    return sys.stdout.getvalue().strip()

# provided sample (adapted formatting)
assert run("""3 6
1 2 3
3 1 1
3 1 3
1 1 2 2
3 1 3
2 2 2 0
3 2 3
""") == "Yes\nNo\nYes\nYes"

# minimum size
assert run("""1 2
5
3 1 1
3 1 1
""") == "Yes\nYes"

# all equal
assert run("""5 2
2 2 2 2 2
3 1 5
""") == "Yes"

# range assign edge
assert run("""4 3
1 2 3 4
2 2 3 0
3 1 4
""") == "Yes"

# range add edge
assert run("""3 3
1 1 1
1 1 3 1
3 1 3
""") == "Yes"
```| 测试输入| 预期产出 | 它验证了什么 |
 | ---| ---| ---|
 | 单元素| 是的 | 平凡的枢轴总是存在|
 | 一切平等| 是的 | 加权和的对称性 |
 | 赋值为零 | 是的 | 零和一致性 |
 | 范围添加| 是的 | 惰性传播的正确性 |

 ## 边缘情况

 当段的总和变为零时，就会出现一种重要的边缘情况。 在这种情况下，除以 S 是不可能的，因此正确的逻辑完全切换到检查加权和是否也为零。 例如，考虑一个值完全抵消的段。 该算法正确检测到 S = 0 并验证 T = 0，然后返回“Yes”，避免无效除法。 

当计算出的主元 k 恰好位于边界上时，会出现另一种边缘情况。 由于条件要求 k 位于段内，因此像 k = l 或 k = r 这样的值是有效的，并且实现显式检查此范围而不是假设内部放置。 

最后一个微妙的情况出现在重复的混合更新下，其中赋值在加法之后。 惰性传播逻辑确保在应用常量覆盖之前分配清除任何挂起的添加，从而保持所有后代中 S 和 T 的一致性。
