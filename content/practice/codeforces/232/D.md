---
title: "CF 232D - 栅栏"
description: "我们有一系列木板高度。 栅栏片只是一个连续的片段。 对于查询段$[l,r]$，我们必须计算有多少个相同长度的其他段与它匹配。 匹配有三个要求。 两个段的长度必须相等。 它们一定是脱节的。"
date: "2026-06-04T09:37:03+07:00"
tags: ["codeforces", "competitive-programming", "binary-search", "data-structures", "string-suffix-structures"]
categories: ["algorithms"]
codeforces_contest: 232
codeforces_index: "D"
codeforces_contest_name: "Codeforces Round 144 (Div. 1)"
rating: 2900
weight: 232
solve_time_s: 410
verified: false
draft: false
---

[CF 232D - 栅栏](https://codeforces.com/problemset/problem/232/D)

 **评分：** 2900
 **标签：** 二分查找、数据结构、字符串后缀结构
 **求解时间：** 6m 50s
 **已验证：** 否

 ## 解决方案
 ## 问题理解

 我们有一系列木板高度。 栅栏片只是一个连续的片段。 

对于查询段$[l,r]$，我们必须计算有多少个相同长度的其他线段与它匹配。 匹配有三个要求。 

两个段的长度必须相等。 

它们一定是脱节的。 

如果我们将它们逐个位置对齐，则相应高度的总和必须始终为相同的值。 对于一个段$[l,r]$和另一段$[a,b]$， 这意味着$$h_{l+i}+h_{a+i}=h_l+h_a$$对于每个有效的偏移量$i$。 

第一反应是直接看高度，但是取差后情况就变得清晰多了。 

让$$d_i=h_i-h_{i+1}$$为了$1\le i<n$。 

假设两个线段的宽度$k$。 匹配条件意味着$$(h_{l+i}-h_{l+i+1}) = -(h_{a+i}-h_{a+i+1})$$对于每个职位。 

换句话说，如果$$d'_i=-d_i,$$那么匹配的段完全对应于差异数组之间的相等子字符串$d$和求反的差分数组$d'$。 这是官方解决方案使用的关键改造。 

制约因素是推动这一转变的原因。 两个都$n$和$q$达到$10^5$。 任何每次查询扫描一个段的算法都会立即变得太慢。 甚至$O(n)$每个查询需要大约$10^{10}$运营。 我们大概需要$O((n+q)\log n)$。 

有几种容易被忽略的边缘情况。 

考虑长度为一的线段。```
h = [5, 8, 1]
query = [2,2]
```一块木板内部没有任何差异。 其他所有单块木板都会自动满足形状条件。 唯一的限制是不相交。 答案是$n-1$。 仅适用于差异数组的解决方案必须仔细处理这种情况，因为相应的差异子字符串的长度为零。 

考虑完全重叠。```
h = [1,2,1]
query = [1,2]
```段本身匹配其自己的模式，但匹配的段要求是不相交的。 计算该模式的所有出现次数并忘记重叠限制会产生太大的答案。 

考虑重复的模式。```
h = [1,2,1,2,1]
query = [1,2]
```相同的模式出现多次。 有些事件与查询段重叠，必须排除，而其他事件则有效。 计数结构必须支持模式匹配和几何位置限制。 

## 方法

 暴力解决方案很简单。 

对于每个查询段，枚举相同长度的每个段。 检查两个线段是否不相交。 然后比较对应的位置并验证匹配情况。 

单次比较成本$O(k)$， 在哪里$k$是段长度。 有$O(n)$候选片段。 在最坏的情况下，查询成本$O(n^2)$，并与$10^5$查询这是无望的。 

关键的观察是匹配条件实际上是连续差异的条件。 

对于匹配段，$$h_{l+i}+h_{a+i}=C.$$减去偏移量方程$i+1$:$$(h_{l+i}-h_{l+i+1}) = -(h_{a+i}-h_{a+i+1}).$$使用$$d_i=h_i-h_{i+1}, \qquad d'_i=-d_i,$$问题变成：

 查找子字符串的出现次数$$d[l..r-1]$$数组内部$d'$。 

现在这个问题看起来像整数字母表上的经典字符串问题。 

官方的解决方案是建立一个后缀数组$$d + [\text{separator}] + d'.$$对于宽度的查询段$k=r-l+1$，我们需要所有后缀$d'$谁的第一个$k-1$差值相等$$d[l..r-1].$$在后缀数组中，所有此类后缀形成一个连续的区间。 我们可以使用 LCP 信息和二分查找找到该区间。 

剩下的任务是计算哪些出现对应于与查询段不相交的栅栏段。 

这成为后缀数组等级上的几何计数问题。 每个查询都会询问：

 后缀数组区间中有多少后缀的起始位置超出禁止范围？ 

持久线段树或小波树样式结构让我们可以回答这个问题$O(\log n)$预处理后。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 |$O(qn^2)$最坏的情况|$O(1)$| 太慢了 |
 | 后缀数组+LCP+持久计数|$O(n\log n + q\log n)$|$O(n\log n)$| 已接受 |

 ## 算法演练

 1.构建差异数组$$d_i=h_i-h_{i+1}.$$还建$$d'_i=-d_i.$$2. 连接$$T=d+[SEP]+d'.$$分隔符的值必须小于每个压缩坐标，以便匹配项不会跨越边界。 
3. 对所有值进行坐标压缩并构建后缀数组$T$。 
4. 构建LCP数组和RMQ结构，这样就可以得到任意两个后缀的LCP$O(1)$。 
5. 对于原始差异数组中的每个位置$d$，存储其后缀数组排名。 
6. 查询$[l,r]$， 让$$len=r-l.$$这是差异子串的长度。 
7. 如果$len=0$，查询段包含一个 plank。 每个不相交的单板段都匹配。 答案是$n-1$。 
8.否则找到位置对应的后缀$l$在$d$。 
9. 对后缀数组位置使用二分查找和 LCP 查询，找到最大后缀数组间隔$[L,R]$包含该后缀，使得区间中的每个后缀至少共享$len$与它的差值。 

这些正是串联结构中所需模式的出现。 
10. 在这些后缀中，只保留属于$d'$一半。 
11.让这样的后缀从位置开始$p$里面$d'$。 它对应一个栅栏段$$[a,b]$$和$$a=p,\qquad b=p+len.$$12. 线段与查询相交 iff$$a\le r \quad\text{and}\quad b\ge l.$$同样，有效的出现满足$$b<l \quad\text{or}\quad a>r.$$13. 使用持久计数结构对后缀数组区间内起始索引满足允许范围的位置进行计数。 
14. 输出计数。 

### 为什么它有效

 到差异数组的转换是精确的。 当且仅当一个段中的每个连续高度差等于另一段中的连续高度差的负值时，两个段满足原始高度和条件。 将几何栅栏条件转换为子串相等性$d$和$d'$。 

后缀数组将相等的前缀分组为连续的间隔。 LCP 条件保证所定位区间内的每个后缀都包含所需的差异模式，并且区间外的后缀不包含所需的差异模式。 

计数结构仅根据不相交要求过滤出现的情况。 由于每个剩余的出现都恰好对应于一个匹配的栅栏段，因此报告的计数正是答案。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

class SuffixArray:
    def __init__(self, s):
        n = len(s)
        sa = list(range(n))
        rank = s[:]
        tmp = [0] * n

        k = 1
        while True:
            sa.sort(key=lambda x: (
                rank[x],
                rank[x + k] if x + k < n else -1
            ))

            tmp[sa[0]] = 0
            for i in range(1, n):
                a, b = sa[i - 1], sa[i]
                tmp[b] = tmp[a] + (
                    (rank[a], rank[a + k] if a + k < n else -1) <
                    (rank[b], rank[b + k] if b + k < n else -1)
                )

            rank, tmp = tmp, rank

            if rank[sa[-1]] == n - 1:
                break
            k <<= 1

        self.sa = sa
        self.rank = rank

        lcp = [0] * (n - 1)
        h = 0
        for i in range(n):
            r = rank[i]
            if r == 0:
                continue
            j = sa[r - 1]
            while i + h < n and j + h < n and s[i + h] == s[j + h]:
                h += 1
            lcp[r - 1] = h
            if h:
                h -= 1

        self.lcp = lcp

        m = max(1, len(lcp))
        lg = [0] * (m + 1)
        for i in range(2, m + 1):
            lg[i] = lg[i >> 1] + 1

        st = [lcp[:]]
        j = 1
        while (1 << j) <= len(lcp):
            prev = st[j - 1]
            cur = [
                min(prev[i], prev[i + (1 << (j - 1))])
                for i in range(len(lcp) - (1 << j) + 1)
            ]
            st.append(cur)
            j += 1

        self.lg = lg
        self.st = st

    def get_lcp(self, i, j):
        if i == j:
            return 10 ** 9
        ri = self.rank[i]
        rj = self.rank[j]
        if ri > rj:
            ri, rj = rj, ri
        l = rj - ri
        k = self.lg[l]
        return min(
            self.st[k][ri],
            self.st[k][rj - (1 << k)]
        )

class Node:
    __slots__ = ("l", "r", "sum")

    def __init__(self, l=None, r=None, s=0):
        self.l = l
        self.r = r
        self.sum = s

def build(lo, hi):
    node = Node()
    if lo != hi:
        mid = (lo + hi) >> 1
        node.l = build(lo, mid)
        node.r = build(mid + 1, hi)
    return node

def update(prev, lo, hi, pos):
    node = Node(prev.l, prev.r, prev.sum + 1)
    if lo != hi:
        mid = (lo + hi) >> 1
        if pos <= mid:
            node.l = update(prev.l, lo, mid, pos)
        else:
            node.r = update(prev.r, mid + 1, hi, pos)
    return node

def query(rt_r, rt_l, lo, hi, ql, qr):
    if ql > hi or qr < lo or ql > qr:
        return 0
    if ql <= lo and hi <= qr:
        return rt_r.sum - rt_l.sum
    mid = (lo + hi) >> 1
    return (
        query(rt_r.l, rt_l.l, lo, mid, ql, qr) +
        query(rt_r.r, rt_l.r, mid + 1, hi, ql, qr)
    )

def solve():
    n = int(input())
    h = list(map(int, input().split()))

    if n == 1:
        q = int(input())
        print("\n".join("0" for _ in range(q)))
        return

    d = [h[i] - h[i + 1] for i in range(n - 1)]
    nd = [-x for x in d]

    vals = sorted(set(d + nd))
    comp = {v: i + 1 for i, v in enumerate(vals)}

    sep = 0
    T = [comp[x] for x in d] + [sep] + [comp[x] for x in nd]

    sa = SuffixArray(T)

    m = n - 1
    offset = m + 1

    roots = [build(1, m)]
    for pos in sa.sa:
        val = 0
        if offset <= pos < offset + m:
            val = pos - offset + 1

        if val:
            roots.append(update(roots[-1], 1, m, val))
        else:
            roots.append(roots[-1])

    q = int(input())
    ans = []

    for _ in range(q):
        l, r = map(int, input().split())

        if l == r:
            ans.append(str(n - 1))
            continue

        pat_len = r - l
        pos = l - 1

        rk = sa.rank[pos]
        N = len(T)

        lo, hi = 0, rk
        left = rk
        while lo <= hi:
            mid = (lo + hi) // 2
            ok = True
            if mid < rk:
                ok = sa.get_lcp(sa.sa[mid], sa.sa[rk]) >= pat_len
            if ok:
                left = mid
                hi = mid - 1
            else:
                lo = mid + 1

        lo, hi = rk, N - 1
        right = rk
        while lo <= hi:
            mid = (lo + hi) // 2
            ok = True
            if mid > rk:
                ok = sa.get_lcp(sa.sa[mid], sa.sa[rk]) >= pat_len
            if ok:
                right = mid
                lo = mid + 1
            else:
                hi = mid - 1

        total = 0

        max_left_start = l - pat_len
        if max_left_start >= 1:
            total += query(
                roots[right + 1],
                roots[left],
                1,
                m,
                1,
                max_left_start
            )

        min_right_start = r + 1
        if min_right_start <= m:
            total += query(
                roots[right + 1],
                roots[left],
                1,
                m,
                min_right_start,
                m
            )

        ans.append(str(total))

    print("\n".join(ans))

if __name__ == "__main__":
    solve()
```该解决方案遵循官方方法的确切结构。 后缀数组标识所需差异模式的所有出现。 持久线段树存储从$d'$半按后缀数组等级排序，允许以对数时间进行间隔计数。 最微妙的部分是栅栏位置和差异数组位置之间的转换。 一段宽度的栅栏$k$对应长度不同的子串$k-1$，这就是为什么后缀结构内的查询长度是`r - l`， 不是`r - l + 1`。 

## 工作示例

 ### 示例 1```
h = [1,2,2,1,100,99,99,100,100,100]
query = [1,4]
```差值数组为：```
d = [-1,0,1,-99,1,0,-1,0,0]
```该查询对应于：```
[-1,0,1]
```向内寻找$d'$:```
[1,0,-1,99,-1,0,1,0,0]
```给出一个有效的出现。 

| 步骤| 价值|
 | --- | --- |
 | 查询段| [1,4]|
 | 长度差| 3 |
 | 图案| [-1,0,1]|
 | d' | 中的匹配出现 开始 = 5 |
 | 不相交| 是的 |
 | 回答 | 1 |

 此示例演示了从栅栏匹配到子字符串匹配的核心简化。 

### 自定义示例```
h = [5,5,5,5]
query = [2,2]
```| 步骤| 价值|
 | --- | --- |
 | 线段长度| 1 |
 | 差值子串长度 | 0 |
 | 所有其他单板匹配| 是的 |
 | 不相交的位置 | 1,3,4 |
 | 回答 | 3 |

 这练习了特殊的长度一情况。 不存在差异值，因此每个不相交的单板都是匹配的。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 |$O(n\log n + q\log n)$| 后缀数组构造加上对数查询处理 |
 | 空间|$O(n\log n)$| 持久线段树和后缀数组结构|

 和$n,q \le 10^5$，这种复杂性完全符合极限。 预处理执行一次，每个查询仅需要少量二分搜索和持久树范围计数。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    out = io.StringIO()
    backup = sys.stdout
    sys.stdout = out
    solve()
    sys.stdout = backup
    return out.getvalue().strip()

assert run(
"""10
1 2 2 1 100 99 99 100 100 100
6
1 4
1 2
3 4
1 5
9 10
10 10
"""
) == "\n".join([
"1",
"2",
"2",
"0",
"2",
"9"
]), "sample 1"

assert run(
"""1
7
1
1 1
"""
) == "0", "minimum size"

assert run(
"""4
5 5 5 5
2
1 1
2 2
"""
) == "\n".join([
"3",
"3"
]), "all equal"

assert run(
"""3
1 2 3
2
1 2
2 3
"""
) == "\n".join([
"0",
"0"
]), "overlapping only"

assert run(
"""5
1 2 1 2 1
1
1 2
"""
) == "1", "repeated pattern"
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 | 单板| 0 | 最小边界 |
 | 所有高度均相等 | 3, 3 | 长度一处理|
 | 增加高度| 0, 0 | 没有匹配的段 |
 | 交替模式| 1 | 多次出现和重叠过滤 |

 ## 边缘情况

 考虑一个长度为一的查询。```
n = 4
h = [5,7,9,11]
query = [2,2]
```算法立即进入特殊分支`l == r`。 每个其他木板都形成有效的匹配段，因为没有内部差异可供比较。 答案是$3$。 

考虑仅出现在重叠位置的模式。```
h = [1,2,1]
query = [1,2]
```所需的差异模式出现一次，即在查询段本身中。 后缀数组间隔包含该事件，但持久计数阶段拒绝它，因为相应的段与查询相交。 答案就变成了$0$。 

考虑多个相同的情况。```
h = [1,2,1,2,1]
query = [1,2]
```差异模式出现不止一次。 后缀数组间隔捕获所有出现的情况。 计数结构仅保留起始位置完全位于查询段之前或完全之后的那些。 最终答案精确计算不相交的匹配项并忽略重叠的匹配项。 

后缀数组区间搜索和位置过滤的组合可以统一处理所有这些情况。
