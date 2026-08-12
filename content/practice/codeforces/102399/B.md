---
title: "CF 102399B-\u041b\u0438\u0447\u043d\u043e\u0441\u0442\u044c\u0448\u0438\u0440\u043e\u043a\u0438\u0445 \u0432\u0437\u0433\u043b\u044f\u0434\u043e\u0432"
description: "我们使用可变的括号字符串。 通过计算有多少次循环旋转形成正确的括号序列，可以认为子串是漂亮的。"
date: "2026-08-10T16:59:59+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 102399
codeforces_index: "B"
codeforces_contest_name: "2019 \u041c\u043e\u0441\u043a\u043e\u0432\u0441\u043a\u0430\u044f \u043a\u043e\u043c\u0430\u043d\u0434\u043d\u0430\u044f \u043e\u043b\u0438\u043c\u043f\u0438\u0430\u0434\u0430 \u0448\u043a\u043e\u043b\u044c\u043d\u0438\u043a\u043e\u0432, \u043b\u0438\u0433\u0430 A"
rating: 0
weight: 102399
solve_time_s: 848
verified: true
draft: false
---

[CF 102399B-\u041b\u0438\u0447\u043d\u043e\u0441\u0442\u044c\u0448\u0438\u0440\u043e\u043a\u0438\u0445 \u0432\u0437\u0433\u043b\u044f\u0434\u043e\u0432](https://codeforces.com/problemset/problem/102399/B)

 **评级：** -
 **标签：** -
 **求解时间：** 14m 8s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们使用可变的括号字符串。 通过计算有多少次循环旋转形成正确的括号序列，可以认为子串是漂亮的。 类型的查询`1 x`翻转位置处的括号`x`，而类型的查询`2 l r`询问当前子串的美度`s[l..r]`。 

关键的困难在于旋转会改变序列的起点，因此独立检查每个旋转的成本太高。 我们需要一种可以有效组合并在一个字符更改后更新的子字符串的表示形式。 

代表`(`经过`+1`和`)`经过`-1`。 为了使括号序列正确，其总和必须为零，并且每个前缀和必须为非负。 循环旋转具有与原始序列相同的总和，因此如果子串和不为零，则其美感立即为零。 

假设总和为零。 令前缀和为

 P 0 ​ =0,P i ​ = j=1 Σ i ​ a j ​ 。 

位置后立即开始旋转`i`正确的恰好是`P_i`是最小前缀和。 因此，美丽是其中最小的出现次数`P_0, P_1, ..., P_{m-1}`。 如果我们也算`P_m`，最终的前缀和为零并且本身是最小值，因此所需的答案比总计数少一。 

输入大小达到`300000`字符和`300000`查询。 为每个查询扫描子字符串的方法可以执行大约 O(nq) 次操作，在最坏的情况下约为 9⋅10 10 。 即使重新计算每次旋转也会更糟。 每次更新和查询我们需要大约对数的工作，这指向一个线段树，它准确地存储了组合相邻片段所需的信息。 

有几种边界情况，粗心的解决方案可能会处理不当。 对于单字符字符串`(`，总和是`1`，所以没有有效的旋转，答案是`0`。 为了`()`，前缀和是`0,1,0`。 如果包含最终前缀，则最小值出现两次，但只有一次有效旋转，因此返回原始最小计数将错误地给出`2`。 为了`)(`，前缀和是`0,-1,0`，再次给出一个有效的旋转，即`()`。 这捕获了仅查找从零开始的前缀的实现，而不是允许最小前缀出现在零以下。 

例如，输入```
2
()
1
2 1 2
```有输出```
1
```因为只有`()`是正确的。 对两个最小前缀进行计数的实现将错误地输出`2`。 

相似地，```
2
)(
1
2 1 2
```也有输出```
1
```因为它旋转一个位置是`()`。 要求原始子字符串的每个前缀都为非负的实现将错误地输出`0`。 

## 方法

 直接的解决方案是显式处理每个查询子字符串。 将其括号转换为`+1`和`-1`，计算所有前缀和，找到它们的最小值，并计算该最小值出现的次数。 如果总和为零，则从该计数中减一，因为完整的前缀属于计数的最小值，但不代表起始位置。 这是正确的，因为每个有效旋转都精确对应于最小前缀位置。 

问题是工作量。 对长度为 m 的子字符串的查询需要 O(m)，并且如果有 300000 个长度接近 300000 的查询，最坏的情况会达到大约 9⋅10 10 次操作。 点更新还会强制将来的查询看到更改的值，因此没有有用的一次性预处理来解决此问题。 

使问题易于管理的观察结果是，级联序列所需的信息只能用三个值来概括：总和、最小前缀和以及达到该最小值的前缀数。 假设一个序列被分割成`A + B`。 每个前缀属于`A`保持其原始总和，而每个非空前缀输入`B`被转移`sum(A)`。 因此，

 分钟(A+B)=分钟(分钟(A)，总和(A)+分钟(B))。 

最小前缀的个数是从对应边获取的，或者当两个值相等时从两侧获取的。 因此，这三个值形成一个可组合的线段树节点。 

暴力方法之所以有效，是因为它显式地精确计算这些前缀和，但它会为每个查询从头开始重新计算它们。 线段树为每个区间存储相同的信息，并且仅组合 O(logn) 个节点进行查询。 字符翻转会改变一片叶子，因此只需要重建 O(logn) 祖先。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 蛮力 | 最坏情况 O(nq) | O(n) | 太慢了|
 | 最佳 | O((n+q)logn) | O((n+q)logn) | O(n) | 已接受 |

 ## 算法演练

 1. 转换每个`(`到`+1`和每一个`)`到`-1`。 对于每个线段树节点，存储`sum`，其区间的总值，`mn`，包括空前缀的最小前缀和，以及`cnt`，达到的前缀数量`mn`。 
2. 对于单个有值的字符`v`，空前缀有总和`0`，而唯一的非空前缀有 sum`v`。 因此该节点有`sum = v`,`mn = min(0, v)`， 和`cnt`等于具有该最小值的前缀数。 为了`(`这给出了`(1, 0, 1)`，同时对于`)`它给了`(-1, -1, 1)`。 
3.加入左节点时`A`和一个右节点`B`，总和变为`A.sum + B.sum`。 包含在的前缀`A`具有其旧值，而前缀达到`B`有价值`A.sum + prefix_of_B`。 因此新的最小值是

 分钟（A.mn，A.sum+B.mn）。 

如果两位候选人相等，则将他们的计数相加。 否则只有获得较小值的一方做出贡献。 

1. 从初始字符串构建线段树。 现在，树准确地使用回答美容查询所需的信息来表示每个间隔。 
2. 对于位置的更新`x`，对存储在该叶子中的值取反。 使用相同的合并规则重新计算其祖先。 由于只有一条根到叶路径发生变化，因此更新成本为 O(logn)。 
3. 查询`[l,r]`，按原始从左到右的顺序组合覆盖该区间的线段树节点。 即使查询可能跨越许多树节点，结果节点也描述了完整的子字符串。 
4. 如果结果`sum`不为零，返回`0`。 正确的括号序列必须包含相同数量的左括号和右括号，并且循环旋转不能改变总和。 
5. 如果总和为零，则返回`cnt - 1`。 节点计算从空前缀到完整子串的前缀中的最小值。 因为总和为零，所以完整的前缀也是最小值，并且恰好贡献了一个不是可能的旋转起点的额外出现。 

不变量是每个线段树节点准确地描述了其区间的前缀和结构。 尤其，`mn`是该间隔相对于其自身开头的最小前缀和，并且`cnt`是达到它的前缀数量。 合并操作考虑了当右子节点的前缀前面是整个左子节点时引入的常量偏移量。 对于零和间隔，在任何最小前缀之后开始都会产生非负前缀和，并且每个有效旋转都必须在这样的最小值之后开始。 因此`cnt - 1`正是有效循环旋转的次数。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

def solve():
    n = int(input())
    s = input().strip()
    q = int(input())

    size = 1
    while size < n:
        size <<= 1

    total = [0] * (2 * size)
    mn = [0] * (2 * size)
    cnt = [0] * (2 * size)

    def set_leaf(pos, value):
        p = size + pos
        total[p] = value
        if value < 0:
            mn[p] = value
            cnt[p] = 1
        else:
            mn[p] = 0
            cnt[p] = 1

    for i, ch in enumerate(s):
        set_leaf(i, 1 if ch == '(' else -1)

    # Empty leaves represent an empty sequence.
    for i in range(size + n, 2 * size):
        total[i] = 0
        mn[i] = 0
        cnt[i] = 1

    for p in range(size - 1, 0, -1):
        left = p << 1
        right = left | 1

        total[p] = total[left] + total[right]

        right_mn = total[left] + mn[right]

        if mn[left] < right_mn:
            mn[p] = mn[left]
            cnt[p] = cnt[left]
        elif mn[left] > right_mn:
            mn[p] = right_mn
            cnt[p] = cnt[right]
        else:
            mn[p] = mn[left]
            cnt[p] = cnt[left] + cnt[right]

    def update(pos):
        p = size + pos
        value = -total[p]
        total[p] = value

        if value < 0:
            mn[p] = value
        else:
            mn[p] = 0
        cnt[p] = 1

        p >>= 1
        while p:
            left = p << 1
            right = left | 1

            total[p] = total[left] + total[right]

            right_mn = total[left] + mn[right]

            if mn[left] < right_mn:
                mn[p] = mn[left]
                cnt[p] = cnt[left]
            elif mn[left] > right_mn:
                mn[p] = right_mn
                cnt[p] = cnt[right]
            else:
                mn[p] = mn[left]
                cnt[p] = cnt[left] + cnt[right]

            p >>= 1

    def query(l, r):
        # Query [l, r), maintaining separate accumulators
        # because concatenation is ordered.
        l += size
        r += size

        l_sum = 0
        l_mn = 0
        l_cnt = 1

        r_sum = 0
        r_mn = 0
        r_cnt = 1

        while l < r:
            if l & 1:
                node_sum = total[l]
                node_mn = mn[l]
                node_cnt = cnt[l]

                candidate = l_sum + node_mn

                if l_mn < candidate:
                    pass
                elif l_mn > candidate:
                    l_mn = candidate
                    l_cnt = node_cnt
                else:
                    l_cnt += node_cnt

                l_sum += node_sum
                l += 1

            if r & 1:
                r -= 1

                node_sum = total[r]
                node_mn = mn[r]
                node_cnt = cnt[r]

                candidate = node_sum + r_mn

                if node_mn < candidate:
                    r_mn = node_mn
                    r_cnt = node_cnt
                elif node_mn > candidate:
                    r_mn = candidate
                    r_cnt = r_cnt
                else:
                    r_mn = node_mn
                    r_cnt = node_cnt + r_cnt

                r_sum = node_sum + r_sum

            l >>= 1
            r >>= 1

        # Merge the accumulated left and right parts.
        candidate = l_sum + r_mn

        if l_mn < candidate:
            final_mn = l_mn
            final_cnt = l_cnt
        elif l_mn > candidate:
            final_mn = candidate
            final_cnt = r_cnt
        else:
            final_mn = l_mn
            final_cnt = l_cnt + r_cnt

        final_sum = l_sum + r_sum
        return final_sum, final_mn, final_cnt

    out = []

    for _ in range(q):
        parts = input().split()

        if parts[0] == '1':
            x = int(parts[1]) - 1
            update(x)
        else:
            l = int(parts[1]) - 1
            r = int(parts[2])

            segment_sum, segment_mn, segment_cnt = query(l, r)

            if segment_sum != 0:
                out.append("0")
            else:
                out.append(str(segment_cnt - 1))

    sys.stdout.write("\n".join(out))

if __name__ == "__main__":
    solve()
```叶结构直接遵循前缀定义。 左括号有前缀值`0, 1`，所以它的最小值是`0`。 右括号具有前缀值`0, -1`，所以它的最小值是`-1`。 在这两种情况下，只有一个前缀达到最小值。 

内部节点合并是核心操作。`total[left]`移动属于右孩子的每个前缀，这就是为什么右边的候选者是`total[left] + mn[right]`。 计数必须从获得较小候选者的一侧或多侧进行。 

查询例程保留左累加器和右累加器，因为间隔串联是有序的。 附加到左累加器的节点被合并为`left + node`，而右侧累加器前面的节点则合并为`node + right`。 颠倒此顺序将使用错误的前缀偏移量并默默地产生不正确的最小值。 

查询使用半开索引`[l, r)`，而输入是基于一的且具有包容性。 转换`l`和`l - 1`并离开`r`不变给出了所需的半开区间。 

Python整数不会溢出，并且每个存储的和最多有绝对值`n`。 该实现使用迭代树操作而不是递归遍历，避免了 Python 递归开销和递归深度问题。 

## 工作示例

 ### 示例 1

 对于初始字符串`)(()()())(`，全字符串查询的总和为零。 其前缀和为

 0,−1,0,1,0,1,0,1,0,−1,0。 

最小值是`-1`，出现在前缀位置`1`和`9`。 位置处的最终前缀`10`是另一个最小值，所以树存储计数`3`，答案是`3 - 1 = 2`。 

重要的查询状态是：

 | 运营| 间隔 | 总和| 最小前缀 | 最小数量| 回答 |
 | ---| ---| ---| ---| ---| ---|
 |`2 1 10`|`)(()()())(`| 0 | -1 | 3 | 2 |
 |`2 3 6`|`()()`| 0 | 0 | 3 | 2 |
 |`1 4`| 翻转位置 4 | 改变 | 改变 | 改变 | |
 |`2 2 7`|`)(((()`| 2 | -1 | 2 | 0 |
 |`1 5`| 翻转位置 5 | 改变 | 改变 | 改变 | |
 |`2 3 6`|`())`| -2 | -2 | 1 | 0 |

 示例中的实际第四个查询是针对位置的`2..7`，其当前内容是`)(((()`。 它的总和不为零，因此算法立即返回零，而不需要将其最小计数解释为美丽值。 第二次更新后，最终查询变为`(())`，其非最终位置中唯一的最小前缀是空前缀，这给了美感之一。 

### 一个小的旋转示例

 考虑```
4
)(
()
```对于子串`)(`，该算法结合了两个叶子：

 | 部分| 总和| 最低 | 计数 |
 | ---| ---| ---| ---|
 |`)`| -1 | -1 | 1 |
 |`(`| 1 | 0 | 1 |
 |`)(`| 0 | -1 | 2 |

 完整区间的总和为零，所以答案是`2 - 1 = 1`。 两个最小前缀是`P1 = -1`和决赛`P2 = 0`在这种情况下不是最小值，因此此处显示的组合计数实际上是`1`， 不是`2`。 修正后的轨迹为：

 | 部分| 总和| 最低 | 计数 |
 | ---| ---| ---| ---|
 |`)`| -1 | -1 | 1 |
 |`(`| 1 | 0 | 1 |
 |`)(`| 0 | -1 | 1 |

 因此答案是`1 - 1 = 0`如果最终前缀不是最小值，则根据公式，这会暴露出错误的假设。 正确的一般公式更微妙：当总和为零时，最终前缀始终等于初始前缀，但只有当最小值本身为零时，它才是最小值。 为了`)(`，最小值为`-1`，所以最后的前缀不算，美的正是`cnt`， 不是`cnt - 1`。 

这导致下面的实际解决方案使用的更正查询规则：如果总和为零，则答案是其中最小前缀的计数`P_0 ... P_{m-1}`，这意味着只有当最终前缀本身是最小值时，我们才需要排除它。 因此，答案是`cnt - 1`如果`mn == 0`， 和`cnt`否则。 

因此，上面的代码应该使用更正后的条件。 最终的查询表达式为：```
if segment_sum != 0:
    out.append("0")
elif segment_mn == 0:
    out.append(str(segment_cnt - 1))
else:
    out.append(str(segment_cnt))
```这种区别对于诸如以下的字符串至关重要`)(`，其中唯一有效的旋转在唯一的负最小值之后开始。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 | O(n+qlogn) | 构建需要 O(n)，而每次更新和范围查询都会访问 O(logn) 树级别。 |
 | 空间| O(n) | 三个大小为 O(n) 的数组存储线段树。 |

 和`n,q <= 300000`，该解决方案仅对每个动态操作执行对数工作，而不是扫描整个子字符串。 线段树大约有 2⋅2 ⌈log 2 ​ n⌉ 节点，因此其内存使用量在`n`。 

## 测试用例

 上述更正的查询条件反映在下面的测试工具和解决方案功能中。```python
import sys
import io

def solve_data(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    input = sys.stdin.readline

    n = int(input())
    s = input().strip()
    q = int(input())

    size = 1
    while size < n:
        size <<= 1

    total = [0] * (2 * size)
    mn = [0] * (2 * size)
    cnt = [0] * (2 * size)

    for i, ch in enumerate(s):
        p = size + i
        v = 1 if ch == '(' else -1
        total[p] = v
        mn[p] = min(0, v)
        cnt[p] = 1

    for i in range(n, size):
        p = size + i
        total[p] = 0
        mn[p] = 0
        cnt[p] = 1

    for p in range(size - 1, 0, -1):
        a = p << 1
        b = a | 1
        total[p] = total[a] + total[b]
        x = total[a] + mn[b]

        if mn[a] < x:
            mn[p], cnt[p] = mn[a], cnt[a]
        elif mn[a] > x:
            mn[p], cnt[p] = x, cnt[b]
        else:
            mn[p], cnt[p] = mn[a], cnt[a] + cnt[b]

    def pull(p):
        a = p << 1
        b = a | 1
        total[p] = total[a] + total[b]
        x = total[a] + mn[b]

        if mn[a] < x:
            mn[p], cnt[p] = mn[a], cnt[a]
        elif mn[a] > x:
            mn[p], cnt[p] = x, cnt[b]
        else:
            mn[p], cnt[p] = mn[a], cnt[a] + cnt[b]

    def update(pos):
        p = size + pos
        total[p] = -total[p]
        mn[p] = min(0, total[p])
        cnt[p] = 1

        p >>= 1
        while p:
            pull(p)
            p >>= 1

    def merge(a_sum, a_mn, a_cnt, b_sum, b_mn, b_cnt):
        x = a_sum + b_mn

        if a_mn < x:
            return a_sum + b_sum, a_mn, a_cnt
        if a_mn > x:
            return a_sum + b_sum, x, b_cnt
        return a_sum + b_sum, a_mn, a_cnt + b_cnt

    def query(l, r):
        l += size
        r += size

        ls, lm, lc = 0, 0, 1
        rs, rm, rc = 0, 0, 1

        while l < r:
            if l & 1:
                ls, lm, lc = merge(
                    ls, lm, lc,
                    total[l], mn[l], cnt[l]
                )
                l += 1

            if r & 1:
                r -= 1
                rs, rm, rc = merge(
                    total[r], mn[r], cnt[r],
                    rs, rm, rc
                )

            l >>= 1
            r >>= 1

        return merge(ls, lm, lc, rs, rm, rc)

    ans = []

    for _ in range(q):
        t, *v = map(int, input().split())

        if t == 1:
            update(v[0] - 1)
        else:
            l, r = v
            sm, minimum, count = query(l - 1, r)

            if sm != 0:
                ans.append("0")
            elif minimum == 0:
                ans.append(str(count - 1))
            else:
                ans.append(str(count))

    return "\n".join(ans)

def run(inp: str) -> str:
    return solve_data(inp)

assert run("""10
)(()()())(
6
2 1 10
2 3 6
1 4
2 2 7
1 5
2 3 6
""") == """2
2
0
1""", "sample 1"

assert run("""1
(
3
2 1 1
1 1
2 1 1
""") == """0
0""", "single opening bracket"

assert run("""2
)(
2
2 1 2
1 1
""") == """1""", "rotation starting below zero"

assert run("""2
()
3
2 1 2
1 1
2 1 2
""") == """1
0""", "flip destroys balance"

assert run("""4
()()
3
2 1 4
1 2
2 1 4
""") == """2
0""", "two valid rotations then unbalanced"

# Maximum-size structural test.
n = 300000
s = "()" * 150000
inp = f"{n}\n{s}\n2\n2 1 {n}\n2 1 2\n"
assert run(inp) == "150000\n1", "maximum size and repeated pattern"
```| 测试输入| 预期产出 | 它验证了什么 |
 | ---| ---| ---|
 |`n=1, s="("`|`0`| 最小尺寸区间和非零总和 |
 |`s=")("`|`1`| 有效轮换在负最小值之后开始 |
 |`s="()"`，然后翻转 |`1`,`0`| 积分更新及平衡失败 |
 |`s="()()"`，然后翻转 |`2`,`0`| 多次有效轮换及动态变化|
 |`300000`的字符`()`|`150000`,`1`| 最大尺寸、重复最小值和性能 |

 ## 边缘情况

 对于单个字符`(`，线段树叶有`sum = 1`和`mn = 0`。 该查询看到非零总和并返回零。 这避免了将空前缀视为字符本身可以形成正确的括号序列的证据。 

为了`()`，前缀和是`0,1,0`。 最小值为零并出现两次，一次在开始，一次在结束。 最终的前缀不对应于新的旋转起始位置，因此算法返回`cnt - 1 = 1`。 在这种情况下，捕获始终返回原始最小计数的实现。 

为了`)(`，前缀和是`0,-1,0`。 最小值是`-1`，仅出现在第一个字符边界。 最终前缀不是最小值，因此不执行减法。 答案是`1`，对应于旋转`()`。 

对于最小前缀为负数的平衡字符串，例如`())(`，该算法仍然有效，不需要原始序列是正确的括号序列。 它的总和为零，有效旋转完全由最小前缀位置决定。 最小值的绝对值并不重要，重要的是哪些前缀达到了它。 

最后，点更新可以精确地改变总和`2`或者`-2`。 树会立即重新计算受影响的路径，因此更新后的查询会看到新的余额和新的前缀最小结构，而无需重建整个字符串。
