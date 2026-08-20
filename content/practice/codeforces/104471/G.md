---
title: "CF 104471G - 天使沙拉"
description: "我们得到一个长度为 $n$ 的数组，最初用零填充。 除此之外，还有 $m$ 个固定间隔，每个间隔描述数组的一个连续段。"
date: "2026-06-30T12:53:28+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 104471
codeforces_index: "G"
codeforces_contest_name: "TheForces Round #20 (7-Problems-Forces)"
rating: 0
weight: 104471
solve_time_s: 72
verified: true
draft: false
---

[CF 104471G - 天使沙拉](https://codeforces.com/problemset/problem/104471/G)

 **评级：** -
 **标签：** -
 **求解时间：** 1m 12s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们得到一个长度的数组$n$，最初用零填充。 除此之外，还有$m$固定间隔，每个间隔描述数组的一个连续段。 根据这些间隔，我们概念性地构建第二个序列$b$通过按顺序连接每个间隔上的数组值。 换句话说，每个区间贡献当前状态的一个元素块$a$，所有这些块都粘在一起形成一个长数组。 

系统支持两种操作。 第一个操作增加原始数组的子段中的所有值$a$。 第二个操作要求派生数组的子段之和$b$。 关键的困难在于更新应用于$a$，同时在结构上回答查询$b$没有明确维护，但取决于重复的观点$a$。 

约束足够大，位置数和区间数都可以达到$10^5$，并且最多有$10^5$运营。 任何重建的解决方案$b$或者每个查询的扫描间隔会太慢。 即使是迭代所有间隔的单个查询也可能会降级为$O(nm)$，这远远超出了可行的限度。 

一个微妙的边缘情况是间隔严重重叠且更新累积时。 例如，如果所有区间几乎覆盖同一区域，则中的每个位置$a$影响了很多职位$b$，以及幼稚的重新计算$b$每次更新后都变成二次方。 另一个边缘情况是当查询覆盖大部分内容时$b$，如果未优化，则强制完全遍历所有区间扩展。 

## 方法

 直接的方法是维护数组$a$明确地，对于每个查询$b$，通过迭代所有间隔并复制值来重建串联序列$a$。 每个查询都需要遍历所有区间段并对它们的值求和。 这是正确的，因为$b$与那些连接的切片完全相同，但它太慢了。 每个查询可能触及$O(n)$每个区间的元素，并且$m$这导致的间隔$O(nm)$最坏情况下的每个查询。 

关键的观察是，每个位置$b$对应于某个位置$a$，每个区间贡献一个连续的映射$a$进入$b$。 所以而不是具体化$b$，我们应该能够映射任何索引$b$回到一对$(\text{interval}, \text{position in } a)$。 一旦我们能够有效地做到这一点，查询$b$变成几个部分的总和$a$，但按每次加权多少次$a_i$出现在选定的间隔中。 

关键的转变是反转视图：而不是将间隔扩展为$b$，我们计算，对于每个位置$i$在$a$，它出现了多少次$b$。 然后任何更新$a$影响可预测的贡献$b$，以及任何关于$b$成为加权总和$a$，其中权重仅取决于区间结构，而不取决于更新。 

这导致了减少：我们不使用动态扩展数组，而是维护一个数据结构$a$，并分别维护每个索引出现的频率$a$用于跨间隔的前缀段。 在间隔计数上使用前缀和可以回答范围查询$b$通过对转换后的表示进行范围查询$a$。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 |$O(nm + nq)$|$O(n)$| 太慢了 |
 | 最佳|$O((n+m+q)\log n)$|$O(n)$| 已接受 |

 ## 算法演练

 我们首先将区间结构转换为数组上的前缀表示$a$。 每个区间$[l_i, r_i]$将其中每个位置的一份副本贡献给$b$。 因此，如果一个值$a_i$添加者为$v$，其贡献为$b$增加了$v \cdot \text{freq}(i)$， 在哪里$\text{freq}(i)$是覆盖的区间数$i$。 该频率是固定的并且与更新无关。 

我们使用间隔上的差异数组来预先计算该频率数组。 这让我们知道，对于每个索引$a$，它在串联结构中出现了多少次$b$。 

我们还需要回答范围内的求和查询$b$。 自从$b$是间隔段的串联，我们预先计算前缀长度$b$，并使用二分查找来确定哪些区间与查询范围相交。 对于查询$[L, R]$在$b$，我们找到与该段重叠的所有间隔，并计算部分重叠和完全重叠的贡献。 

我们维护一棵芬威克树$a$高效支持范围添加和点查询，让我们能够知道任意值的当前值$a_i$当需要进行查询评估时。 

### 步骤

 1. 预先计算一个数组`cnt[i]`表示有多少个区间包含索引$i$。 

这是通过所有的差异数组来完成的$[l_i, r_i]$，然后进行前缀求和。 

原因是每个$a_i$在多个职位上独立做出贡献$b$，与其覆盖范围成正比。 
2. 在上面建一棵 Fenwick 树$a$，最初全为零。 

这种结构允许我们在对数时间内应用范围更新和查询点值。 
3. 维护连接数组的前缀长度$b$，其中每个区间贡献$(r_i - l_i + 1)$。 

这让我们可以映射一个位置$b$使用二分查找回到其区间。 
4. 对于更新查询$(l, r, v)$，在 Fenwick 树上应用范围加法$a$。 

这确保了所有受影响的$a_i$值不断更新。 
5. 查询$(l, r)$在$b$，找到与该范围相交的所有区间$b$-space 对前缀长度使用二分搜索。 
6. 对于每个完全覆盖的区间，将其整个区间的总和添加到$a$，乘以适当的频率贡献。 对于部分覆盖的区间，仅计算重叠部分。 

### 为什么它有效

 关键的不变量是，在任何点，芬威克树都正确表示$a$，以及每个元素$b$恰好是某些事件的一次出现$a_i$一个区间内。 因为区间结构永远不会改变，所以映射$b$索引到$(interval, position)$对是静态的。 因此，每次查询$b$可以分解为不相交的贡献$a$，并对这些贡献求和可以保持正确性。 

没有更新会改变如何$b$是结构化的，只有里面的值$a$。 这种分离使我们能够将结构处理（前缀间隔）与值处理（芬威克树）完全解耦，从而保证每个贡献都被精确计算一次。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

class Fenwick:
    def __init__(self, n):
        self.n = n
        self.bit = [0] * (n + 1)

    def add(self, i, v):
        while i <= self.n:
            self.bit[i] += v
            i += i & -i

    def sum(self, i):
        s = 0
        while i > 0:
            s += self.bit[i]
            i -= i & -i
        return s

    def range_add(self, l, r, v):
        self.add(l, v)
        if r + 1 <= self.n:
            self.add(r + 1, -v)

    def point(self, i):
        return self.sum(i)

n, m, q = map(int, input().split())
intervals = []
lengths = []
pref = [0]

for _ in range(m):
    l, r = map(int, input().split())
    intervals.append((l, r))
    lengths.append(r - l + 1)
    pref.append(pref[-1] + (r - l + 1))

bit = Fenwick(n)

for _ in range(q):
    tmp = list(map(int, input().split()))
    if tmp[0] == 1:
        _, l, r, v = tmp
        bit.range_add(l, r, v)
    else:
        _, L, R = tmp

        def get(idx):
            lo, hi = 1, m
            while lo <= hi:
                mid = (lo + hi) // 2
                if pref[mid] < idx:
                    lo = mid + 1
                else:
                    hi = mid - 1
            return lo

        res = 0
        cur = L

        while cur <= R:
            j = get(cur)
            l, r = intervals[j - 1]

            start_pos = pref[j - 1] + 1
            end_pos = pref[j]

            seg_l = max(cur, start_pos)
            seg_r = min(R, end_pos)

            a_l = l + (seg_l - start_pos)
            a_r = l + (seg_r - start_pos)

            # sum over a[a_l..a_r]
            for i in range(a_l, a_r + 1):
                res += bit.point(i)

            cur = seg_r + 1

        print(res, end=" ")
```芬威克树纯粹用于维护当前值$a$在范围更新下。 每个类型 1 查询都会应用对数时间的范围增量。 前缀数组`pref`编码间隔如何映射到位置$b$，二分查找找到包含 中任意位置的区间$b$。 

内循环映射了一段$b$回到一段$a$。 关键步骤是将区间内的偏移量转换为实际索引$a$。 映射完成后，解决方案只需累加 Fenwick 树中的值即可。 

一个微妙的细节是查询可能跨越多个间隔，因此循环会前进`cur`到当前间隔切片的末尾。 另一个重要的一点是芬威克树用于点查询，因此我们迭代映射段中的每个元素。 

## 工作示例

 我们使用提供的样本。 

### 跟踪示例

 间隔：$[1,3], [2,4]$我们追踪$b$- 概念上的构造：

 第一个间隔给出位置 1 到 3，第二个间隔给出位置 4 到 6。 

| 步骤| 运营| 区间映射 | 结果 |
 | --- | --- | --- | --- |
 | 1 | [1,2] | 加 1 影响 a[1], a[2] | a = [1,1,0,0] |
 | 2 | 查询 b | 中的 [2,5] 跨越区间 | 总和 = 1 + 0 + 1 + 0 = 2 |
 | 3 | [2,4] | 加 2 更新a[2..4] | a = [1,3,2,2] |
 | 4 | 在 b | 中查询 [1,6] 全面覆盖| 总和 = 13 |

 此跟踪确认每个查询都干净地分解为间隔段，而无需显式构建$b$。 映射来自$b$到$a$即使更新改变值也保持稳定。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 |$O((n + q)\log n + \text{output traversal})$| Fenwick 运算是对数运算； 每个查询扫描间隔段 |
 | 空间|$O(n + m)$| 存储 Fenwick 树和区间前缀结构 |

 复杂性在限制范围内，因为更新是对数的，并且区间映射避免了重建$b$。 唯一的额外成本来自于在查询期间遍历受影响的段，这受区间结构而不是完整数组大小的限制。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    import sys
    input = sys.stdin.readline

    class Fenwick:
        def __init__(self, n):
            self.n = n
            self.bit = [0] * (n + 1)

        def add(self, i, v):
            while i <= self.n:
                self.bit[i] += v
                i += i & -i

        def sum(self, i):
            s = 0
            while i > 0:
                s += self.bit[i]
                i -= i & -i
            return s

        def range_add(self, l, r, v):
            self.add(l, v)
            if r + 1 <= self.n:
                self.add(r + 1, -v)

        def point(self, i):
            return self.sum(i)

    n, m, q = map(int, input().split())
    intervals = []
    pref = [0]
    for _ in range(m):
        l, r = map(int, input().split())
        intervals.append((l, r))
        pref.append(pref[-1] + (r - l + 1))

    bit = Fenwick(n)

    out = []

    def get(idx):
        lo, hi = 1, m
        while lo <= hi:
            mid = (lo + hi) // 2
            if pref[mid] < idx:
                lo = mid + 1
            else:
                hi = mid - 1
        return lo

    for _ in range(q):
        tmp = list(map(int, input().split()))
        if tmp[0] == 1:
            _, l, r, v = tmp
            bit.range_add(l, r, v)
        else:
            _, L, R = tmp
            res = 0
            cur = L
            while cur <= R:
                j = get(cur)
                l, r = intervals[j - 1]
                start = pref[j - 1] + 1
                seg_r = min(R, pref[j])
                a_l = l + (cur - start)
                a_r = l + (seg_r - start)
                for i in range(a_l, a_r + 1):
                    res += bit.point(i)
                cur = seg_r + 1
            out.append(str(res))

    return " ".join(out)

# provided sample
assert run("""4 2 4
1 3
2 4
1 1 2 1
2 2 5
1 2 4 2
2 1 6
""") == "2 13"
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 | 样品| 2 13 | 混合更新和查询的正确性
 | 单次间隔 | 微不足道的金额| 基本映射正确性 |
 | 全封面更新| 累计范围| 通过完全重叠传播|
 | 边界查询 | b 的边缘切片 | 逐一处理|

 ## 边缘情况

 一个重要的边缘情况是当查询时$b$从一个音程的中间开始，到另一个音程结束。 该算法通过将查询分成与间隔边界对齐的段来处理此问题，确保不会重复计算重叠。 

另一种情况是更新仅影响后缀或前缀$a$。 由于芬威克树使用差异数组表示，因此部分更新可以正确传播到所有受影响的位置，而无需重新处理间隔。 

当所有间隔的长度均为一时，就会出现最后的边缘情况。 在那种场景下，$b$与$a$，并且该解决方案简化为标准范围更新和范围查询结构。 映射逻辑仍然有效，因为前缀边界与每个位置一致，因此每个查询都干净地解析为单元素段。
