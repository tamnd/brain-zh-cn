---
title: "CF 1477B - Nezzar 和二进制字符串"
description: "我们从一个二进制字符串开始，经过一系列操作后，它最终必须成为另一个二进制字符串。 每天都会检查固定的部分。 如果该段同时包含 0 和 1，则该过程立即失败。"
date: "2026-06-10T23:53:23+07:00"
tags: ["codeforces", "competitive-programming", "data-structures", "greedy"]
categories: ["algorithms"]
codeforces_contest: 1477
codeforces_index: "B"
codeforces_contest_name: "Codeforces Round 698 (Div. 1)"
rating: 1900
weight: 1477
solve_time_s: 145
verified: true
draft: false
---

[CF 1477B - Nezzar 和二进制字符串](https://codeforces.com/problemset/problem/1477/B)

 **评级：** 1900
 **标签：** 数据结构，贪心
 **求解时间：** 2m 25s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们从一个二进制字符串开始，经过一系列操作后，它最终必须成为另一个二进制字符串。 

每天都会检查固定的部分。 如果该段包含两者`0`和`1`，该过程立即失败。 这意味着在每次检查之前，被检查的段必须完全`0`或完全`1`s。 

检查后，在晚上，我们被允许修改同一段内不到一半的字符。 

输入给出原始字符串`s`，所需的最终字符串`f`，以及检查段的顺序。 我们必须确定是否存在某种有效的夜间修改序列`s`进入`f`同时在检查时保持每个检查段的一致性。 

约束条件是表明预期方向的第一件事。 在所有测试用例中，字符串总长度和查询总数最多均为`2 · 10^5`。 对于每个查询来说，触及段的每个位置的解决方案大约需要`O(nq)`操作，可以达到约`4 · 10^10`在最坏的情况下。 那是完全不可行的。 我们周围需要一些东西`O((n+q) log n)`。 

问题最微妙的方面是，操作是按时间向前描述的，但最终的字符串是已知的。 正向模拟很困难，因为每天晚上可能有很多可能的方法来修改该段。 

如果我们不小心的话，一些边缘情况会导致错误的推理。 

考虑一个长度为偶数且当前正好包含一半零和一半一的段。```
length = 4
segment = 0011
```为了使段统一，我们需要更改两个字符。 规则只允许严格更改少于一半的段，因此禁止更改两个字符。 任何将“最多一半”视为有效的解决方案都会错误地接受此类情况。 

另一个危险的情况是已经拥有绝对多数的细分市场。```
segment = 0001
```由于只有不到一半的头寸可能会发生变化，因此前一天之前唯一可能的统一状态是全零。 变成全的话需要改变三个位置，这已经超出了限制。 粗心的实现允许任一统一值都是错误的。 

最后，当根本没有查询时，就不可能进行任何转换。```
n = 3, q = 0
s = 101
f = 111
```答案是`NO`因为字符串永远不会改变。 任何算法都必须显式验证重构的初始状态是否等于`s`。 

## 方法

 暴力方法会尝试模拟该过程。 开始于`s`，对于每个查询，我们将确定检查的段是否统一，然后考虑可能的夜间修改。 困难在于可能可以到达许多不同的中间字符串。 探索所有可能性很快就会呈指数级增长。 

即使我们以某种方式避免了分支并且只跟踪一个状态，为每个查询更新整个段也会花费成本`O(nq)`时间。 当两个值都达到`2 · 10^5`，这远远超出了极限。 

关键的观察是最终的字符串`f`是已知的。 而不是问我们如何才能到达`f`，我们问是否`f`可能是由有效的操作序列产生的。 

假设我们正在查看一个查询段`[l,r]`那天晚上修改后我们立即知道了该字符串。 在修改之前，该段会是什么样子？ 

设段长度为`len`，并让它当前包含`ones`那些。 

在夜间作业之前，该路段肯定是完全一致的，因为它刚刚通过检查。 

如果统一值为`0`，那么夜间操作就完全改变了`ones`职位。 

如果统一值为`1`，那么夜间操作就完全改变了`len - ones`职位。 

因为只有不到一半的位置可以改变，所以这些可能性中只有一种是有效的。 

如果`ones < len/2`，那么该段之前必须全为零。 

如果`ones > len/2`，那么该段之前必须是全 1。 

如果`ones = len/2`，这两种可能性都行不通，因为两者都需要改变恰好一半的位置。 

这完全消除了歧义。 

开始于`f`，我们以相反的顺序处理查询。 对于每个段，我们计算它当前包含的数量。 

如果计数恰好是段长度的一半，则无法重建。 

否则，我们用强制多数值覆盖整个段并继续。 

反转所有查询后，我们获得原始字符串的唯一可能候选者。 如果匹配的话`s`，答案是`YES`; 否则`NO`。 

剩下的挑战是有效支持范围计数查询和范围分配更新。 这是一个经典的延迟传播线段树问题。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | O(nq) 或更糟 | O(n) | 太慢了 |
 | 最佳| O((n + q) log n) | O((n + q) log n) | O(n) | 已接受 |

 ## 算法演练

 1. 根据最终字符串构建线段树`f`。 

每个节点存储其区间内的个数。 
2. 以相反的顺序处理查询。 

逆向将问题从“多种可能的未来状态”转变为“至多一种可能的先前状态”。 
3. 对于当前段`[l,r]`，查询里面有多少个。 

让`len = r - l + 1`。 
4.如果`2 * ones == len`，立即返回`NO`。 

先前的统一段无法产生恰好一半 1 和一半 0 的状态，同时严格更改少于一半的位置。 
5. 如果`2 * ones < len`，将整个段赋值为零。 

在执行此操作之前，该段必须全为零。 
6. 否则将整个段分配给一个。 

在执行此操作之前，该段必须已全部为 1。 
7. 继续，直到处理完所有反向查询。 
8.重建完成后，将每个位置与原始字符串进行比较`s`。 

如果任何位置不同，则返回`NO`。 
9. 如果重构的字符串匹配`s`， 返回`YES`。 

### 为什么它有效

 关键的不变量是，在反向处理查询时，线段树始终表示紧随相应的前向时间操作之后的字符串的唯一状态。 

考虑反向查询段。 设当前的个数为`ones`。 

如果`ones < len/2`，从全一段获得这种状态需要改变一半以上的位置。 唯一有效的前驱是全零段。 

如果`ones > len/2`，对称论证表明唯一有效的前驱是全一段。 

如果`ones = len/2`，两位候选人前任都要求恰好改变一半的职位，这是被禁止的。 

因此，每个反向步骤要么是唯一确定的，要么是不可能的。 该算法准确地重建了有效前向过程中可能存在的状态集。 如果重建到达的字符串不同于`s`，则没有有效序列从`s`。 如果重建达到`s`，向前重放反向推理会产生有效的操作序列。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

class SegmentTree:
    def __init__(self, arr):
        self.n = len(arr)
        self.tree = [0] * (4 * self.n)
        self.lazy = [-1] * (4 * self.n)
        self._build(1, 0, self.n - 1, arr)

    def _build(self, node, l, r, arr):
        if l == r:
            self.tree[node] = arr[l]
            return

        mid = (l + r) // 2
        self._build(node * 2, l, mid, arr)
        self._build(node * 2 + 1, mid + 1, r, arr)
        self.tree[node] = self.tree[node * 2] + self.tree[node * 2 + 1]

    def _apply(self, node, l, r, val):
        self.tree[node] = (r - l + 1) * val
        self.lazy[node] = val

    def _push(self, node, l, r):
        if self.lazy[node] == -1 or l == r:
            return

        mid = (l + r) // 2
        val = self.lazy[node]

        self._apply(node * 2, l, mid, val)
        self._apply(node * 2 + 1, mid + 1, r, val)

        self.lazy[node] = -1

    def update(self, ql, qr, val):
        self._update(1, 0, self.n - 1, ql, qr, val)

    def _update(self, node, l, r, ql, qr, val):
        if qr < l or r < ql:
            return

        if ql <= l and r <= qr:
            self._apply(node, l, r, val)
            return

        self._push(node, l, r)

        mid = (l + r) // 2
        self._update(node * 2, l, mid, ql, qr, val)
        self._update(node * 2 + 1, mid + 1, r, ql, qr, val)

        self.tree[node] = self.tree[node * 2] + self.tree[node * 2 + 1]

    def query(self, ql, qr):
        return self._query(1, 0, self.n - 1, ql, qr)

    def _query(self, node, l, r, ql, qr):
        if qr < l or r < ql:
            return 0

        if ql <= l and r <= qr:
            return self.tree[node]

        self._push(node, l, r)

        mid = (l + r) // 2
        return (
            self._query(node * 2, l, mid, ql, qr) +
            self._query(node * 2 + 1, mid + 1, r, ql, qr)
        )

def solve():
    t = int(input())
    ans = []

    for _ in range(t):
        n, q = map(int, input().split())
        s = input().strip()
        f = input().strip()

        queries = []
        for _ in range(q):
            l, r = map(int, input().split())
            queries.append((l - 1, r - 1))

        st = SegmentTree([int(c) for c in f])

        ok = True

        for l, r in reversed(queries):
            ones = st.query(l, r)
            length = r - l + 1

            if ones * 2 == length:
                ok = False
                break

            if ones * 2 < length:
                st.update(l, r, 0)
            else:
                st.update(l, r, 1)

        if not ok:
            ans.append("NO")
            continue

        for i in range(n):
            if st.query(i, i) != int(s[i]):
                ok = False
                break

        ans.append("YES" if ok else "NO")

    sys.stdout.write("\n".join(ans))

if __name__ == "__main__":
    solve()
```线段树只存储一条信息，即每个区间内的个数。 这正是逆向过程决定前驱状态所需的。 

惰性传播至关重要，因为每个反向步骤都会用全零或全一覆盖整个段。 如果没有惰性传播，单次更新可能会花费线性时间。 

对比`s`仅在应用了所有反向操作后才执行。 此时线段树代表重建的初始字符串。 

平等测试使用`ones * 2 == length`而不是浮点除法。 这避免了精度问题并直接表达语句中的严格半条件。 

## 工作示例

 ### 示例 1```
n = 5
s = 00000
f = 00111

queries:
[1,5]
[1,3]
```相反的顺序是`[1,3]`， 然后`[1,5]`。 

| 步骤| 细分 | 那些 | 长度 | 行动| 状态|
 | --- | --- | --- | --- | --- | --- |
 | 开始| - | - | - | 最初的`f`| 00111 |
 | 1 | [1,3]| 1 | 3 | 多数0，填0 | 00011 |
 | 2 | [1,5]| 2 | 5 | 多数0，填0 | 00000 |

 最终重建的字符串是`00000`，等于`s`。 

回答：`YES`。 

这条痕迹显示了逆向重建的中心思想。 每个段都有严格多数，因此前一个段是唯一确定的。 

### 示例 2```
n = 2
s = 00
f = 01

query:
[1,2]
```逆向处理：

 | 步骤| 细分 | 那些 | 长度 | 行动|
 | --- | --- | --- | --- | --- |
 | 开始| - | - | - | 状态 = 01 |
 | 1 | [1,2]| 1 | 2 | 不可能|

 该段恰好包含一个零和一个一。 从统一的段达到这样的状态需要改变恰好一半的位置。 

回答：`NO`。 

此示例演示了最重要的拒绝条件。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | O((n + q) log n) | O((n + q) log n) | 每个查询执行一次范围查询和一次范围分配 |
 | 空间| O(n) | 线段树和惰性数组|

 总价值`n`和`q`所有测试用例最多`2 · 10^5`。 通过在线段树上的对数运算，总工作量完全在限制范围内。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    from io import StringIO
    sys.stdin = StringIO(inp)
    out = StringIO()

    input = sys.stdin.readline

    class SegmentTree:
        def __init__(self, arr):
            self.n = len(arr)
            self.tree = [0] * (4 * self.n)
            self.lazy = [-1] * (4 * self.n)
            self.build(1, 0, self.n - 1, arr)

        def build(self, node, l, r, arr):
            if l == r:
                self.tree[node] = arr[l]
                return
            m = (l + r) // 2
            self.build(node * 2, l, m, arr)
            self.build(node * 2 + 1, m + 1, r, arr)
            self.tree[node] = self.tree[node * 2] + self.tree[node * 2 + 1]

        def apply(self, node, l, r, v):
            self.tree[node] = (r - l + 1) * v
            self.lazy[node] = v

        def push(self, node, l, r):
            if self.lazy[node] == -1 or l == r:
                return
            m = (l + r) // 2
            v = self.lazy[node]
            self.apply(node * 2, l, m, v)
            self.apply(node * 2 + 1, m + 1, r, v)
            self.lazy[node] = -1

        def update(self, node, l, r, ql, qr, v):
            if qr < l or r < ql:
                return
            if ql <= l and r <= qr:
                self.apply(node, l, r, v)
                return
            self.push(node, l, r)
            m = (l + r) // 2
            self.update(node * 2, l, m, ql, qr, v)
            self.update(node * 2 + 1, m + 1, r, ql, qr, v)
            self.tree[node] = self.tree[node * 2] + self.tree[node * 2 + 1]

        def query(self, node, l, r, ql, qr):
            if qr < l or r < ql:
                return 0
            if ql <= l and r <= qr:
                return self.tree[node]
            self.push(node, l, r)
            m = (l + r) // 2
            return (
                self.query(node * 2, l, m, ql, qr)
                + self.query(node * 2 + 1, m + 1, r, ql, qr)
            )

    t = int(input())
    ans = []

    for _ in range(t):
        n, q = map(int, input().split())
        s = input().strip()
        f = input().strip()

        qs = []
        for _ in range(q):
            l, r = map(int, input().split())
            qs.append((l - 1, r - 1))

        st = SegmentTree([int(c) for c in f])

        ok = True

        for l, r in reversed(qs):
            ones = st.query(1, 0, n - 1, l, r)
            ln = r - l + 1

            if ones * 2 == ln:
                ok = False
                break

            st.update(1, 0, n - 1, l, r, 1 if ones * 2 > ln else 0)

        if ok:
            for i in range(n):
                if st.query(1, 0, n - 1, i, i) != int(s[i]):
                    ok = False
                    break

        ans.append("YES" if ok else "NO")

    return "\n".join(ans)

assert run("""1
1 0
0
0
""") == "YES"

assert run("""1
1 0
0
1
""") == "NO"

assert run("""1
2 1
00
01
1 2
""") == "NO"

assert run("""1
5 2
00000
00111
1 5
1 3
""") == "YES"

assert run("""1
5 1
11111
11111
1 5
""") == "YES"
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 |`n=1, q=0, s=f`| 是 | 最小实例 |
 |`n=1, q=0, s≠f`| 否 | 没有可用的操作 |
 |`00 → 01`段长度为 2 | 否 | 完全不可能|
 | 第一个示例案例 | 是 | 逆向重建成功 |
 | 所有具有冗余查询的| 是 | 统一段仍然有效 |

 ## 边缘情况

 考虑：```
1
2 1
00
01
1 2
```段长度为`2`并且恰好包含一个`1`。 在逆向处理过程中我们得到`ones = 1`,`length = 2`， 所以`2 * ones = length`。 算法立即拒绝。 这符合规则，因为仅更改两个位置中的一个并不严格小于一半。 

考虑：```
1
4 1
0000
0001
1 4
```该段包含一个`1`和三个`0`s。 逆向处理看到严格的零多数并将前身重建为`0000`。 最终重构的字符串等于`s`，所以答案是`YES`。 该算法正确地识别了唯一可能的前任。 

考虑：```
1
3 0
101
111
```没有任何疑问。 反相不做功。 重建的字符串仍然存在`111`，不等于原始字符串`101`。 算法返回`NO`，正确认识到不能进行任何修改。 

考虑：```
1
3 0
101
101
```同样没有查询，但现在重建的字符串已经匹配`s`。 算法返回`YES`，这正是不需要更改时的预期行为。
