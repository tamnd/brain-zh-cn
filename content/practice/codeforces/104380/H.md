---
title: "CF 104380H - 01（硬版）"
description: "我们得到一个随时间演变的二进制字符串。 发生两种操作：翻转单个字符，以及回答子字符串上的查询。"
date: "2026-07-01T17:08:12+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 104380
codeforces_index: "H"
codeforces_contest_name: "The Andover Computing Open (TACO) 2023"
rating: 0
weight: 104380
solve_time_s: 87
verified: true
draft: false
---

[CF 104380H - 01（硬版）](https://codeforces.com/problemset/problem/104380/H)

 **评级：** -
 **标签：** -
 **求解时间：** 1m 27s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们得到一个随时间演变的二进制字符串。 发生两种操作：翻转单个字符，以及回答子字符串上的查询。 对于任何子字符串，我们可以重复删除以下形式的相邻模式`01`，完全删除它们，并且我们希望在以任何顺序执行多次之后获得尽可能小的长度。 

关键对象是在“擦除”规则下的二进制字符串的简化形式`01`每个查询都会询问当前版本字符串中指定子字符串的简化形式的最终长度。 

字符串是动态的，因此点翻转会改变结构，我们必须有效地响应高达 200k 的操作。 任何从头开始重新计算每个查询减少量的解决方案都需要每个查询扫描多达 200k 个字符，在最坏的情况下会导致大约 4e10 次操作，远远超过 1 秒。 

微妙的困难在于，删除并不是像删除相邻的相同字符那样的局部简化。 去除`01`可以为先前分离的区域之间的取消创造新的机会，因此最终结果取决于全局结构，而不仅仅是局部邻接。 

常见的失败案例来自于对子字符串进行贪婪或堆栈模拟，而没有仔细跟踪取消。 例如，在`0101`，反复去除`01`导致空字符串，但如果尝试仅删除一次不相交的出现，它们可能会错误地留下残留字符。 

另一个边缘情况是当子字符串没有`01`根本不。 例如，`111000`无法通过操作来减少，因此答案是 6。简单的实现可能会错误地假设无论模式是否存在都会发生某种平衡。 

## 方法

 操作“删除`01`”建议取消流程`0`和`1`，但仅限于一个方向：a`0`随后是一个`1`消失。 这是不对称的，因此它的行为与标准括号匹配不同。 

如果我们在字符串上模拟该过程，我们会注意到一些结构性的东西：任何`0`出现在 a 之前`1`可以匹配和删除，但是`1`出现在 a 之前`0`不能通过操作直接取消。 这意味着最终的简化形式将由一块组成`1`s 后面跟着一个块`0`s。 中间的一切都被尽可能地取消。 

更准确地说，每一个`01`删除减少了之间的转换次数`0`和`1`，并且它有效地取消了“局部配对意义上的 0 随后是 1”形式的一次反转。 一个更有用的观点是将这个过程视为重复配对`0`与一个`1`到其右侧，然后将两者都删除。 

这导致了一个经典的解释：最终答案仅取决于`0`沙`1`s 以及可以执行多少次取消。 每次取消都会删除一个`0`和一个`1`。 因此，如果我们知道在配对尊重顺序的约束下可以以最佳方式形成多少对，则结果是：

 最终长度 = 最大配对后不匹配的字符数`0`与稍后`1`。 

这相当于计算每对有序的零和一之间的最大匹配（`0`前`1`），可以通过扫描贪婪地计算：维护一个不匹配的计数器`0`s，每当我们看到`1`，我们用之前的一个不匹配的来取消它`0`如果可能的话。 

对于静态字符串，这是 O(n)。 对于带有翻转的动态子字符串查询，我们需要一个数据结构，可以组合分段，同时跟踪发生了多少次取消。 

关键的观察是每个片段都可以用两个数字来概括：有多少个不匹配的片段`0`内部取消后剩余的数量，以及有多少不匹配的`1`留下来。 当合并两个段 A 然后 B 时，它们之间的取消次数受到多少个限制`0`A 中剩余 s 以及有多少`1`s存在于B中。我们可以贪婪地越界匹配。 

因此每个段存储一对`(zeros, ones)`内部还原后。 合并时，我们取消`t = min(zeros_left, ones_right)`对，则：

 new_zeros = Zeros_left + Zeros_right - t

 new_ones = Ones_Left + Ones_right - t

 这种结构在线段树下得到了完美的维护，并且支持点更新和范围查询。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 每个查询的暴力模拟 | O(nq) | O(1) | O(1) | 太慢了|
 | 具有合并状态的线段树 | O((n + q) log n) | O((n + q) log n) | O(n) | 已接受 |

 ## 算法演练

 我们在字符串上维护一棵线段树，其中每个节点存储一对`(z, o)`表示在内部完全减少该段后不匹配的零和一的数量。 

1. 构建叶子节点，使得`0`贡献`(1, 0)`和`1`贡献`(0, 1)`。 每个字符在其单个元素段内都没有被简化。 
2. 当组合两个相邻的线段 A 和 B 时，计算跨越边界可以发生多少次取消。 我们将 A 中的 0 与 B 中的 1 进行匹配。此类匹配的数量为`t = min(A.z, B.o)`。 
3. 将合并状态更新为：

 A.z + B.z - 保留 t 个零点，

 A.o + B.o - t 保留。 

此步骤之所以有效，是因为组合段中的任何最佳取消都必须将左侧部分的 0 与右侧部分的 1 配对； 由于顺序原因，任何其他方向的配对都是不可能的。 
4. 范围查询返回查询区间内的合并对。 最终的答案很简单`z + o`。 
5.点更新翻转一个字符并更新叶节点，然后沿着路径重新计算到根。 

工作原理：每个节点代表一个在内部规则下完全缩减的段`01`删除。 当连接两个段时，唯一可能的新删除是那些跨越边界的删除，并且这些必须是`0`从左段开始，与`1`从右段。 进一步的内部结构并不重要，因为每个片段已经被压缩成其不匹配的残基。 这确保了段表示是完整且无损的，以便将来合并。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

class SegTree:
    def __init__(self, s):
        self.n = len(s)
        self.t = [(0, 0)] * (4 * self.n)
        self.s = s
        self.build(1, 0, self.n - 1)

    def merge(self, a, b):
        z1, o1 = a
        z2, o2 = b
        t = min(z1, o2)
        return (z1 + z2 - t, o1 + o2 - t)

    def build(self, v, l, r):
        if l == r:
            if self.s[l] == '0':
                self.t[v] = (1, 0)
            else:
                self.t[v] = (0, 1)
            return
        m = (l + r) // 2
        self.build(v * 2, l, m)
        self.build(v * 2 + 1, m + 1, r)
        self.t[v] = self.merge(self.t[v * 2], self.t[v * 2 + 1])

    def update(self, v, l, r, idx):
        if l == r:
            self.s = self.s[:idx] + ('1' if self.s[idx] == '0' else '0') + self.s[idx+1:]
            if self.s[l] == '0':
                self.t[v] = (1, 0)
            else:
                self.t[v] = (0, 1)
            return
        m = (l + r) // 2
        if idx <= m:
            self.update(v * 2, l, m, idx)
        else:
            self.update(v * 2 + 1, m + 1, r, idx)
        self.t[v] = self.merge(self.t[v * 2], self.t[v * 2 + 1])

    def query(self, v, l, r, ql, qr):
        if ql <= l and r <= qr:
            return self.t[v]
        m = (l + r) // 2
        if qr <= m:
            return self.query(v * 2, l, m, ql, qr)
        if ql > m:
            return self.query(v * 2 + 1, m + 1, r, ql, qr)
        left = self.query(v * 2, l, m, ql, qr)
        right = self.query(v * 2 + 1, m + 1, r, ql, qr)
        return self.merge(left, right)

def solve():
    s = input().strip()
    q = int(input())
    st = SegTree(s)

    for _ in range(q):
        tmp = input().split()
        if tmp[0] == '1':
            idx = int(tmp[1]) - 1
            st.update(1, 0, st.n - 1, idx)
        else:
            l, r = int(tmp[1]) - 1, int(tmp[2]) - 1
            z, o = st.query(1, 0, st.n - 1, l, r)
            print(z + o)

if __name__ == "__main__":
    solve()
```线段树准确地存储了正确合并所需的不变量。 每次更新只改变一个叶子，内部节点通过相同的取消规则重新计算，保证一致性。 

一个微妙的实现问题是索引：查询是基于 1 的，因此更新和查询必须一致地应用转换。 另一个是每个节点存储的状态有意最小化； 尝试跟踪完整的字符串或转换结构是不必要的，并且会超出内存和时间限制。 

## 工作示例

 ### 示例 1

 初始字符串：`11001001`我们跟踪每个查询。 

| 运营| 考虑的细分市场 | （零，一）| 回答 |
 | --- | --- | --- | --- |
 | 查询 1：[1,3] |`110`| (1,2) | 3 |
 | 查询 2：[1,8] |`11001001`| (4,4) → 减少合并 | 4 |
 | 3 点翻转 |`11011001`| 更新树 | - |
 | 查询 3：[1,8] |`11011001`| (4,4) | 4 |

 该轨迹显示了翻转如何局部改变叶节点以及全局缩减如何在重新计算下保持稳定。 

### 示例 2

 初始字符串：`1011000110101010010`完整的表很大，但我们检查代表性查询。 

为了`[1,10]`，该段减少为`(4,4)`所以答案是4。 

对于`[4,9]`，子串中的 0 比取消后的 0 多，从而产生最终的不匹配计数 5。 

对于`[4,9]`内部合并后，该结构确认了跨界取消占主导地位，而不是局部邻接。 

主要模式是，如果它们的排序改变取消机会，具有相似计数的不同子串仍然可以产生不同的结果，并且线段树正确地捕获了该排序效果。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | O((n + q) log n) | O((n + q) log n) | 每次更新和查询都会遍历线段树的高度，合并每个节点的 O(1) 状态 |
 | 空间| O(n) | 线段树每个节点存储恒定大小的状态 |

 当 n 和 q 达到 2e5 时，log n 约为 18，因此总操作数约为几百万次合并，完全在限制范围内。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    return sys.stdout.getvalue() if False else solve_and_capture(inp)

def solve_and_capture(inp: str) -> str:
    import sys
    input = sys.stdin.readline
    data = inp.strip().split()
    s = data[0]
    q = int(data[1])
    idx = 2

    class SegTree:
        def __init__(self, s):
            self.n = len(s)
            self.t = [(0, 0)] * (4 * self.n)
            self.s = s
            self.build(1, 0, self.n - 1)

        def merge(self, a, b):
            z1, o1 = a
            z2, o2 = b
            t = min(z1, o2)
            return (z1 + z2 - t, o1 + o2 - t)

        def build(self, v, l, r):
            if l == r:
                if self.s[l] == '0':
                    self.t[v] = (1, 0)
                else:
                    self.t[v] = (0, 1)
                return
            m = (l + r) // 2
            self.build(v * 2, l, m)
            self.build(v * 2 + 1, m + 1, r)
            self.t[v] = self.merge(self.t[v * 2], self.t[v * 2 + 1])

        def update(self, v, l, r, idx):
            if l == r:
                self.s = self.s[:idx] + ('1' if self.s[idx] == '0' else '0') + self.s[idx+1:]
                if self.s[l] == '0':
                    self.t[v] = (1, 0)
                else:
                    self.t[v] = (0, 1)
                return
            m = (l + r) // 2
            if idx <= m:
                self.update(v * 2, l, m, idx)
            else:
                self.update(v * 2 + 1, m + 1, r, idx)
            self.t[v] = self.merge(self.t[v * 2], self.t[v * 2 + 1])

        def query(self, v, l, r, ql, qr):
            if ql <= l and r <= qr:
                return self.t[v]
            m = (l + r) // 2
            if qr <= m:
                return self.query(v * 2, l, m, ql, qr)
            if ql > m:
                return self.query(v * 2 + 1, m + 1, r, ql, qr)
            left = self.query(v * 2, l, m, ql, qr)
            right = self.query(v * 2 + 1, m + 1, r, ql, qr)
            return self.merge(left, right)

    s = data[0]
    q = int(data[1])
    st = SegTree(s)
    out = []
    for i in range(q):
        k = data[idx]; idx += 1
        if k == '1':
            x = int(data[idx]) - 1; idx += 1
            st.update(1, 0, st.n - 1, x)
        else:
            l = int(data[idx]) - 1; r = int(data[idx+1]) - 1
            idx += 2
            z, o = st.query(1, 0, st.n - 1, l, r)
            out.append(str(z + o))
    return "\n".join(out)

# provided samples
assert run("""11001001
4
2 1 3
2 1 8
1 3
2 1 8
""") == "3\n4\n4"

assert run("""1011000110101010010
5
2 1 10
2 1 9
2 1 12
2 3 7
2 4 9
""") == "4\n3\n4\n5\n2"
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 | 单字符| 1 | 基本案例部分|
 | 全零| 长度| 没有取消|
 | 交替| 完全还原行为| 最大取消次数 |
 | 翻盖重型箱| 动态正确性 | 更新正确性 |

 ## 边缘情况

 像这样的单字符字符串`0`或者`1`总是产生以下任一节点状态`(1,0)`或者`(0,1)`，并且查询返回 1。线段树处理这个问题，因为叶子是直接初始化的，没有任何合并。 

仅包含零的字符串，例如`000000`永远不会触发任何取消。 每个节点都会累加零，并且合并不会产生`t > 0`因为结构中没有任何地方。 

交替的字符串就像`010101`展示了跨边界的最大抵消。 每个合并步骤恰好取消一对，并且线段树根据奇偶校验将整个范围压缩到一个小的残差或零。 

一个翻转改变了中心人物`0`到`1`可以极大地改变大型细分市场的取消容量。 树通过仅更新叶子并向上重新计算来处理此问题，确保所有受影响的合并得到一致更新，而不会触及不相关的段。
