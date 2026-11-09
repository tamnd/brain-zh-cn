---
title: "CF 2038J - 等待..."
description: "我们处理公交车站发生的事件的时间表。 有两种事件。 P x 事件意味着 x 个普通乘客到达并开始等待。 B x 事件意味着一辆巴​​士到达时有 x 个空闲座位。 当公共汽车到达时，普通乘客总是在 Monocarp 之前上车。"
date: "2026-06-08T10:07:00+07:00"
tags: ["codeforces", "competitive-programming", "greedy", "implementation"]
categories: ["algorithms"]
codeforces_contest: 2038
codeforces_index: "J"
codeforces_contest_name: "2024-2025 ICPC, NERC, Southern and Volga Russian Regional Contest (Unrated, Online Mirror, ICPC Rules, Preferably Teams)"
rating: 800
weight: 2038
solve_time_s: 108
verified: true
draft: false
---

[CF 2038J - 等待...](https://codeforces.com/problemset/problem/2038/J)

 **评分：** 800
 **标签：** 贪心，实现
 **求解时间：** 1m 48s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们处理公交车站发生的事件的时间表。 

有两种事件。 一个`P x`事件手段`x`普通旅客到达并开始等待。 一个`B x`事件意味着巴士到达`x`免费座位。 

当公共汽车到达时，普通乘客总是在 Monocarp 之前上车。 如果等待的乘客多于座位，则只有尽可能多的乘客登机，其余乘客留在队列中。 如果所有等待的乘客都适合，他们就会离开车站。 

Monocarp的特殊之处在于，当所有普通乘客都上车后，他可以选择是否乘坐仍有空座的公交车。 他可以跳过这样的公共汽车并继续等待稍后的公共汽车。 

对于每个公交车事件，我们必须确定 Monocarp 是否存在某种选择序列，允许他登上该特定公交车。 

事件数量最多为 1000 个，数量非常少。 甚至一个$O(n^2)$解决方案最多执行大约一百万次操作。 这意味着我们不需要复杂的数据结构或高级优化。 挑战在于了解哪些信息真正重要。 

微妙之处在于，Monocarp 的决定只影响一件事：当未来的公共汽车到达时，他是否仍在等待。 普通乘客的行为是确定性的。 无论 Monocarp 的选择如何，他们的队列都会以相同的方式演变。 

一个常见的错误是贪婪地模拟 Monocarp，例如总是登上第一辆可用的巴士。 考虑：```
P 2
B 3
B 1
```正确答案是：```
YES
YES
```Monocarp 可以登上第一辆巴士，因为两名乘客上车后还剩下一个座位。 他也可以选择跳过这趟巴士并登上第二辆巴士。 永久让他乘坐第一辆公共汽车的模拟将错误地打印`NO`换第二辆巴士。 

另一个容易犯的错误是忘记无法适应的乘客会继续等待：```
P 10
B 3
B 8
```正确答案是：```
NO
YES
```首班车发车后，七名乘客仍在等待。 当第二辆巴士到达时，七个人全部上车，为 Monocarp 留下一个空闲座位。 

当没有普通乘客等待时，就会出现第三种边缘情况：```
B 1
```答案是：```
YES
```公共汽车立即有空位，因此 Monocarp 可以上车。 

## 方法

 蛮力的观点是独立考虑每条总线。 对于特定的公交车，我们可以重播之前的所有事件，跟踪等待乘客的数量，并在为乘客提供服务后检查该公交车是否有空闲座位。 这是正确的，因为普通乘客是决定座位可用性的唯一因素。 如果巴士至少有一个空闲座位，Monocarp 可以简单地选择不登上任何较早的巴士并乘坐这一辆。 

和$m$公共汽车和$n$事件总数，重播每辆巴士成本的历史记录$O(nm)$，这变成$O(n^2)$在最坏的情况下。 和$n \le 1000$，这已经足够快了。 

关键的观察是我们甚至不需要重新计算历史。 普通乘客的队列的演变独立于 Monocarp。 我们可以处理一次事件，维持当前等待乘客的数量。 

假设一辆公共汽车到达`b`座位并且有`wait`目前在车站的乘客。 

如果`b > wait`，那么当所有普通乘客登机后，至少还剩下一个座位。 Monocarp只要继续等到现在就可以乘坐这趟巴士。 答案是`YES`。 

如果`b <= wait`，每个座位都是普通旅客消费的。 Monocarp 没有机会登上这辆巴士，所以答案是`NO`。 

应答后，必须更新普通队列。 巴士移除`min(wait, b)`乘客，离开`max(0, wait - b)`。 

这种单通道模拟会立即给出每条总线的结果。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | O(n²) | O(1) | O(1) | 已接受 |
 | 最佳 | O(n) | O(1) | O(1) | 已接受 |

 ## 算法演练

 1. 初始化`wait = 0`，当前等待的普通乘客数量。 
2. 按时间顺序处理事件。 
3. 如果事件是`P x`，通过设置将这些乘客添加到队列中`wait += x`。 
4. 如果事件是`B x`，将总线容量与当前队列大小进行比较。 
5. 如果`x > wait`，则所有普通旅客登机后还剩下一些座位。 输出`YES`。 

Monocarp 总是可以选择忽略之前的每一个机会，但仍然会出现在这辆巴士上。 
6.否则输出`NO`。 

每个座位都是普通乘客，所以Monocarp根本没有机会进去。 
7.通过设置在公交车发车后更新乘客队列`wait = max(0, wait - x)`。 

这正好排除了设法登机的乘客。 

### 为什么它有效

 关键的不变量是`wait`始终等于当前在车站等候的普通乘客数量。 

Monocarp 永远不会影响这个数量，因为普通乘客在他之前登机，他的决定不会改变有多少普通乘客到达或离开。 

对于巴士`b`座位，普通乘客正好占据`min(wait, b)`座位。 Monocarp 的空闲座位恰好在$$b - \min(wait, b) > 0$$这相当于`b > wait`。 

如果`b > wait`, Monocarp 可以搭乘此巴士。 如果`b <= wait`，在轮到他之前所有座位都被占用了。 由于算法精确地检查每辆公交车的这种情况，同时保持正确的乘客数量，因此每个答案都是正确的。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

def solve():
    n = int(input())
    wait = 0
    ans = []

    for _ in range(n):
        typ, val = input().split()
        val = int(val)

        if typ == 'P':
            wait += val
        else:
            if val > wait:
                ans.append("YES")
            else:
                ans.append("NO")

            wait = max(0, wait - val)

    sys.stdout.write("\n".join(ans))

if __name__ == "__main__":
    solve()
```变量`wait`准确存储当前等待的普通乘客数量。 

对于乘客事件，我们只需添加此计数即可。 

对于总线事件，我们首先使用当前队列大小回答查询。 顺序很重要。 该决定取决于有多少乘客在登上到达的巴士之前等待。 

产生答案后，我们更新队列。 如果巴士有足够的座位，所有等待的乘客都会离开并`wait`变为零。 否则，正好`val`乘客登机和`wait`减少`val`。 

所有算术都可以轻松地适合 Python 整数。 即使单个事件加起来可能达到$10^6$乘客数量，总数仍远低于 Python 的限制。 

## 工作示例

 ### 示例 1

 输入：```
10
P 2
P 5
B 8
P 14
B 5
B 9
B 3
P 2
B 1
B 2
```| 活动 | 等待之前| 行动| 输出| 等待 |
 | --- | --- | --- | --- | --- |
 | P 2 | 0 | 添加乘客 | - | 2 |
 | P 5 | 2 | 添加乘客 | - | 7 |
 | B 8 | 7 | 8 > 7 | 8 > 7 是 | 0 |
 | 第 14 页 | 0 | 添加乘客 | - | 14 | 14
 | B 5 | 14 | 14 5 ≤ 14 | 否 | 9 |
 | B 9 | 9 | 9≤9| 否 | 0 |
 | B 3 | 0 | 3 > 0 | 3 > 0 是 | 0 |
 | P 2 | 0 | 添加乘客 | - | 2 |
 | B 1 | 2 | 1 ≤ 2 | 否 | 1 |
 | B 2 | 1 | 2 > 1 | 2 > 1 是 | 0 |

 输出：```
YES
NO
NO
YES
NO
YES
```该跟踪显示只有当前的乘客队列很重要。 Monocarp 早期的选择不会影响未来的座位可用性。 

### 示例 2

 输入：```
5
P 10
B 3
B 8
P 1
B 1
```| 活动 | 等待之前| 行动| 输出| 等待 |
 | --- | --- | --- | --- | --- |
 | 第 10 页 | 0 | 添加乘客 | - | 10 | 10
 | B 3 | 10 | 10 3 ≤ 10 | 否 | 7 |
 | B 8 | 7 | 8 > 7 | 8 > 7 是 | 0 |
 | P 1 | 0 | 添加乘客 | - | 1 |
 | B 1 | 1 | 1 ≤ 1 | 否 | 0 |

 输出：```
NO
YES
NO
```此示例演示了总线仅删除队列的一部分的情况。 剩下的乘客继续等待，影响后来的公交车。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | O(n) | 每个事件仅处理一次 |
 | 空间| O(1) | O(1) | 仅维护少数变量，不包括输出存储 |

 对于最多 1000 个事件，线性解很容易在时间限制内完成。 与可用的 512 MB 相比，内存使用量是恒定的并且可以忽略不计。 

## 测试用例```python
# helper: run solution on input string, return output string
import sys
import io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)

    input = sys.stdin.readline

    n = int(input())
    wait = 0
    ans = []

    for _ in range(n):
        typ, val = input().split()
        val = int(val)

        if typ == "P":
            wait += val
        else:
            ans.append("YES" if val > wait else "NO")
            wait = max(0, wait - val)

    return "\n".join(ans)

# provided sample
assert run(
"""10
P 2
P 5
B 8
P 14
B 5
B 9
B 3
P 2
B 1
B 2
"""
) == """YES
NO
NO
YES
NO
YES""", "sample 1"

# minimum input
assert run(
"""1
B 1
"""
) == "YES", "single bus"

# exact equality
assert run(
"""2
P 5
B 5
"""
) == "NO", "no seat remains for Monocarp"

# passengers remain after first bus
assert run(
"""3
P 10
B 3
B 8
"""
) == """NO
YES""", "carry-over queue"

# consecutive buses with empty stop
assert run(
"""3
B 1
B 2
B 3
"""
) == """YES
YES
YES""", "all buses available"
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 |`B 1`|`YES`| 最小有效输入|
 |`P 5, B 5`|`NO`| 平等案例，无余座|
 |`P 10, B 3, B 8`|`NO YES`| 剩下的乘客依然坚持
 |`B 1, B 2, B 3`|`YES YES YES`| 跨多辆公交车的空队列 |

 ## 边缘情况

 考虑平等的情况：```
2
P 5
B 5
```在巴士到达之前，`wait = 5`。 这辆公共汽车正好有五个座位。 五个座位全部被普通乘客占据，剩下零个座位。 算法检查`5 > 5`，这是错误的，并且输出：```
NO
```这避免了使用时的常见错误`>=`而不是`>`。 

考虑一个部分服务的队列：```
3
P 10
B 3
B 8
```最初`wait = 10`。 在第一条总线之后，算法输出`NO`和更新`wait`到`7`。 对于第二趟巴士，`8 > 7`，所以它输出`YES`。 第一辆巴士上的剩余乘客被正确保存。 

考虑多个可用总线：```
3
P 2
B 3
B 1
```在第一趟公交车上，`3 > 2`，所以答案是`YES`。 巴士出发后，队列就空了。 在第二趟公交车上，`1 > 0`，所以答案也是`YES`。 

这证实了我们没有模拟 Monocarp 的单个固定决策。 每辆公交车都会根据“Monocarp 可以选择乘坐这辆公交车吗？”这个问题进行独立评估，这正是问题所在。
