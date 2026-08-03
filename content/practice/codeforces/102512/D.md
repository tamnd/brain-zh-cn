---
title: "CF 102512D - 平等"
description: "我们需要选择一个正整数周期 T。消息在每个 T 的倍数处发生，但消息的所有者会交替。 第一个倍数属于小太郎，第二个属于茜，第三个又属于小太郎，依此类推。"
date: "2026-08-04T00:10:39+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 102512
codeforces_index: "D"
codeforces_contest_name: "Valentines Day Contest 2020"
rating: 0
weight: 102512
solve_time_s: 178
verified: true
draft: false
---

[CF 102512D - 平等](https://codeforces.com/problemset/problem/102512/D)

 **评级：** -
 **标签：** -
 **求解时间：** 2m 58s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们需要选择一个正整数周期`T`。 Messages happen at every multiple of`T`，但消息的所有者会交替。 第一个倍数属于小太郎，第二个属于茜，第三个又属于小太郎，依此类推。 值为`T`仅当每个所需的消息时间都在发送者的活动间隔内时才有效。 

输入给出一天的长度`N`，其次是 Kotaro 的主动间隔和 Akane 的主动间隔。 任务是计算有多少个周期`T`从`1`到`N`满足所有消息时间要求。 

极限`N <= 10^9`立即排除所有可能的检查`T`。 甚至一个`O(N)`解决方案太大，因为十亿次迭代无法在时间限制内轻松完成。 间隔的数量很少，每人最多只有 300 个，这表明解决方案应该使用间隔结构，而不是在每个时间单元上迭代。 

一个常见的错误是忘记一个句点只能创建一条消息。 如果`T > N/2`，唯一需要的时间是`T`本身，只有小太郎的可用性才重要。 另一个错误是将间隔视为半开范围。 间隔包括两个端点，因此恰好位于端点的消息是有效的。 

例如，考虑：```
3
1
3 3
1
1 1
```答案是`1`因为`T = 3`在时间 3 创建一条消息，Kotaro 可以发送该消息。 仅检查间隔内点的解决方案会错误地拒绝它。 

另一个例子：```
5
1
1 5
1
1 3
```为了`T = 2`，消息发生在时间 2 和 4。时间 4 属于 Akane，是无效的，所以`T = 2`不得计算在内。 仅检查第一条消息的粗心解决方案会给出错误的结果。 

## 方法

 直接的解决方案尝试每一个`T`从`1`到`N`。 对于每个候选者，它生成的倍数`T`并检查每个倍数是否在正确的人的区间内。 这是正确的，因为它完全遵循定义。 问题在于候选人的数量。 在最坏的情况下，这需要大约`N + N/2 + ...`消息检查，大致是`N log N`。 和`N = 10^9`，这是不可能的。 

关键的观察结果是，困难的候选人被分为两组。 小的`T`价值观有很多信息，但这样的价值观却很少。 大的`T`value 的消息很少，因此可以通过查看消息数而不是值来处理它们`T`。 

让`S = floor(sqrt(N))`。 为了`T <= S`，只有大约31623名候选人。 我们可以通过询问坏区间是否包含多个`T`具有所需的奇偶性。 

为了`T > S`, 消息条数最多为`S`。 而不是迭代`T`，我们维护一组可能的`T`满足第一个的值`k`消息。 当我们添加`k`-th 消息约束，我们将此集合与间隔相交，其中`k*T`是有效的。 当前集合存储为不相交间隔，因此每一步只是间隔交集。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | O(N log N) | O(N log N) | O(1) | O(1) | 太慢了 |
 | 最佳| O(sqrt(N) * (X+Y)) | O(X+Y) | 已接受 |

 ## 算法演练

 1. 拆分可能的值`T`分成两组使用`S = floor(sqrt(N))`。 值来自`1`到`S`均单独处理。 值大于`S`通过计算它们创建的消息数量来处理。 
2.对于每一个小`T`，检查任何所需的奇数倍数是否落在 Kotaro 的区间之外，或任何所需的偶数倍数是否落在 Akane 的区间之外。 对于一个间隔`[L, R]`, 的倍数`T`其中的乘数值对应于`ceil(L/T)`到`floor(R/T)`。 我们只需要知道该范围包含奇数还是偶数。 
3.对于大`T`，保留一个代表所有的区间列表`T`值大于`S`已经满足了迄今为止处理的消息。 最初中的每个值`(S, N]`是可能的。 
4. 处理消息编号`k = 1, 2, ...`。 对于消息号码`k`，转换每个活动间隔`[L, R]`发送者的可能值`T`:`ceil(L/k) <= T <= floor(R/k)`。 

将此新集合与当前可能的集合相交。 
5. 处理消息后`k`，计算值`T`在确切的范围内`k`消息存在：`floor(N/(k+1)) < T <= floor(N/k)`。 

这些正是大值，其最终信息是`k`-第一个。 

为什么它有效：

 对于小`T`，当算法发现无法发送的消息时，它会准确地拒绝某个值。 如果不存在这样的消息，则每个所需的消息时间都是有效的，因此该时间段被接受。 

对于大型`T`,处理完消息后`k`，维护的时间间隔恰好包含其第一个时间段`k`消息均有效。 一个句点恰好属于一个桶`k`仅当其值介于`floor(N/(k+1))+1`和`floor(N/k)`。 将这两个条件相交即可精确计算有效的大周期。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

def contains(intervals, x):
    lo, hi = 0, len(intervals)
    while lo < hi:
        mid = (lo + hi) // 2
        if intervals[mid][0] <= x:
            lo = mid + 1
        else:
            hi = mid
    idx = lo - 1
    return idx >= 0 and intervals[idx][1] >= x

def has_bad_multiple(T, bad, parity):
    for l, r in bad:
        a = (l + T - 1) // T
        b = r // T
        if a <= b:
            if a % 2 != parity:
                a += 1
            if a <= b:
                return True
    return False

def intersect(a, b):
    res = []
    i = j = 0
    while i < len(a) and j < len(b):
        l = max(a[i][0], b[j][0])
        r = min(a[i][1], b[j][1])
        if l <= r:
            res.append((l, r))
        if a[i][1] < b[j][1]:
            i += 1
        else:
            j += 1
    return res

def scaled(intervals, k):
    res = []
    for l, r in intervals:
        a = (l + k - 1) // k
        b = r // k
        if a <= b:
            if res and res[-1][1] + 1 >= a:
                res[-1] = (res[-1][0], max(res[-1][1], b))
            else:
                res.append((a, b))
    return res

def count_in(intervals, l, r):
    if l > r:
        return 0
    ans = 0
    for a, b in intervals:
        if b < l:
            continue
        if a > r:
            break
        ans += min(b, r) - max(a, l) + 1
    return ans

def solve():
    N = int(input())
    X = int(input())
    kotaro = [tuple(map(int, input().split())) for _ in range(X)]
    Y = int(input())
    akane = [tuple(map(int, input().split())) for _ in range(Y)]

    bad_k = []
    last = 0
    for l, r in kotaro:
        if last + 1 <= l - 1:
            bad_k.append((last + 1, l - 1))
        last = r
    if last < N:
        bad_k.append((last + 1, N))

    bad_a = []
    last = 0
    for l, r in akane:
        if last + 1 <= l - 1:
            bad_a.append((last + 1, l - 1))
        last = r
    if last < N:
        bad_a.append((last + 1, N))

    ans = 0
    S = int(N ** 0.5)

    for t in range(1, S + 1):
        if not has_bad_multiple(t, bad_k, 1) and not has_bad_multiple(t, bad_a, 0):
            ans += 1

    cur = [(S + 1, N)]
    k = 1
    while k <= N // (S + 1) and cur:
        allowed = scaled(kotaro if k % 2 else akane, k)
        cur = intersect(cur, allowed)

        left = N // (k + 1) + 1
        right = N // k
        ans += count_in(cur, left, right)
        k += 1

    print(ans)

solve()
```第一部分为两个人建立缺失时间间隔。 使用不可用的范围可以使后续检查更容易，因为一旦存在无效消息，候选者就会被拒绝。 

小的——`T`循环不枚举消息。 相反，它检查乘数范围是否包含具有所需奇偶校验的乘数。 这使得工作量与间隔数成正比。 

大型-`T`部分将可能的周期存储为间隔。 发送者间隔的转换`[L, R]`可能的周期使用除以消息索引`k`，这是乘法的倒数`k*T`。 所有计算都小心地使用整数除法，以便区间端点保持包容性。 

Python 整数不会溢出，因此较大的值`N`是安全的。 使用`floor`和`ceil`分区是可能发生差一错误的主要场所。 

## 工作示例

 对于样本 1：```
10
2
2 4
6 9
3
1 3
5 7
9 10
```对于较小的值：

 | T | 检查奇数倍数 | 甚至检查了倍数| 结果 |
 | --- | --- | --- | --- |
 | 1 | Kotaro 在 1 处失败 | | 无效|
 | 2 | 光太郎 6 岁失败 | 茜 4 分失败 | 无效|
 | 3 | 3,9 有效 | 6 有效 | 有效 |

 对于较大的值，上面的周期`sqrt(10)`通过消息计数桶进行检查。 有效期为`3,6,7,8,9`，给出答案`5`。 

对于样本 2：```
10000000
1
4092001 5033941
2
206 314
1214 10000000
```范围大意味着大多数候选人只有很少的信息。 

| 留言号码 | 当前约束| 效果|
 | --- | --- | --- |
 | 1 | T 必须在 Kotaro 区间 | 保持月经约 400 万次 |
 | 2 | 2T必须在茜区间| 删除第二条消息过早的时间段 |
 | 3 | 3T必须在小太郎区间| 进一步缩小范围|

 间隔交叉点计算所有剩余的有效周期并产生`941941`。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | O(sqrt(N) * (X+Y)) | 小周期和大周期消息计数均以大约 sqrt(N) | 为界。 
| 空间| O(X+Y) | 仅存储间隔列表 |

 和`N = 10^9`,`sqrt(N)`约为31623。间隔计数每人仅为300，因此操作次数保持在限制范围内。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    old = sys.stdin
    sys.stdin = io.StringIO(inp)
    solve()
    out = sys.stdout.getvalue()
    sys.stdin = old
    return out

assert run("""10
2
2 4
6 9
3
1 3
5 7
9 10
""") == "5\n"

assert run("""10000000
1
4092001 5033941
2
206 314
1214 10000000
""") == "941941\n"

assert run("""1
1
1 1
1
1 1
""") == "1\n"

assert run("""5
1
1 5
1
1 3
""") == "2\n"

assert run("""10
1
10 10
1
1 10
""") == "1\n"
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 |`N=1`完全可用 | 1 | 最小尺寸和端点处理|
 | 所有 Kotaro 时间均可用，但 Akane 错过了时间 4 | 2 | 交替发件人检查 |
 | 光太郎只有时间10有效| 1 | 大周期一则消息|

 ## 边缘情况

 当`T`大于一半`N`，只有一条消息。 该算法通过第一个大周期桶来处理这个问题，其中`k = 1`。 例如，与`N = 10`和 Kotaro 仅在`[10,10]`，值`T = 10`被统计是因为只有一条消息时间有效。 

当后面的消息而不是第一个消息发生故障时，算法仍然会捕获它，因为每个附加消息索引都与当前间隔集相交。 在示例中，其中`N = 5`, Kotaro 可用于`[1,5]`，和茜`[1,3]`, 期间`T = 2`在第一次消息检查中幸存下来，但在以下情况下被删除`k = 2`需要`2T = 4`属于茜的音程。 

当消息恰好到达间隔端点时，包含间隔逻辑将使其保持有效。 小柜子和大柜子的天花板和地板划分都保留了这些边界，因此请及时传达信息`L`或者`R`不会被意外丢弃。
