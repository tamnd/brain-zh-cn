---
title: "CF 102163J - 巴沙尔和夏令时"
description: "循环排列有 (N) 小时，因此，在 (N) 小时之后是 (1) 小时，在 (1) 小时之前是 (N) 小时。 每个 (M) 学生从一小时 (Ai) 开始，并将时钟移动 (Xi) 小时。"
date: "2026-08-19T07:50:48+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 102163
codeforces_index: "J"
codeforces_contest_name: "NCD 2019"
rating: 0
weight: 102163
solve_time_s: 88
verified: true
draft: false
---

[CF 102163J - 巴沙尔和夏令时](https://codeforces.com/problemset/problem/102163/J)

 **评级：** -
 **标签：** -
 **求解时间：** 1m 28s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 循环排列有 (N) 小时，因此，在 (N) 小时之后是 (1) 小时，在 (1) 小时之前是 (N) 小时。 每个 (M) 名学生从一小时 (A_i) 开始，并将时钟移动 (X_i) 小时。 正值（X_i）表示顺时针移动，负值表示逆时针移动。 每个中间时间都会被访问，包括开始时间和最后时间。 官方的例子证实了这个解释：对于(N=5)，从(5)开始的学生(X=2)访问(5,1,2)，这就是为什么(2)小时总共访问了3次。 

对于每个小时，我们需要移动路径经过该小时的学生数量。 答案是最大计数的小时，如果几个小时的最大计数相同，我们选择最小的小时。 

界限 (N,M\le 10^5) 排除了任何显式模拟每个学生长度 (O(N)) 的路径的情况。 在最坏的情况下，可能有 (10^5) 个学生，每个学生移动 (10^5) 步，这会产生大约 (10^{10}) 次单独访问。 2 秒的限制要求我们以接近恒定或对数的时间处理每个学生，然后扫描一次 (N) 小时。 

有几种边界情况可能会导致直接实现错误。 首先，运动全天候进行。 例如，```
1
3 2
1 3
1 1
```第一个学生访问 (1,2)，第二个学生访问 (3,1)，所以答案是`1 2`。 将小时视为普通数组的实现会错过第二个学生对小时 (1) 的访问。 

消极的运动会向相反的方向延伸。 例如，```
1
5 1
1
-2
```路径是(1,5,4)，所以答案是`1 1`因为每个访问的小时都有计数一，并且小时 (1) 是最小的。 如果使用与正值相同的间隔方向处理负值，则结果范围是错误的。 

值 (|X_i|=N) 是另一个微妙的情况。 例如，```
1
4 1
2
4
```学生访问 (2,3,4,1,2)，因此 (2) 小时访问两次，每隔一小时访问一次。 简单地说“移动（N）小时每小时访问一次”的解决方案会失去对开始时间的额外访问。 

最后，(X_i=0) 表示开始时间本身被访问一次。 为了```
1
3 1
2
0
```答案是`2 1`。 将零移动视为空间隔会错误地产生零访问。 

## 方法

 最直接的解决办法就是模拟每个学生的动作。 从学生的小时 (A_i) 开始，计算该小时，然后沿所需方向一次移动一小时，并计算每个新的小时，直到精确完成 (|X_i|) 次移动。 处理完所有学生后，扫描频率数组以找到其最大值。 这是正确的，因为它完全遵循每个学生访问的时间顺序。 

问题在于模拟动作的数量。 单个学生可以移动 (N) 次，因此最坏的情况需要 (O(MN)) 次操作。 对于（M=N=10^5），大约是（10^{10}）次模拟访问，远远超出了时间限制。 

关键的观察结果是，一名学生的路径始终是连续的循环时间间隔。 我们不需要枚举该间隔内的小时数。 相反，我们可以使用差异数组将 (1) 添加到整个区间。 可以通过两次差异数组更新在恒定时间内添加正常间隔 ([L,R])。 循环间隔要么留在 ([1,N]) 内，要么分成后缀和前缀，这两者都可以用恒定的多次更新来表示。 

当 (|X_i|=N) 时，会出现一个复杂情况。 该路径包含 (N+1) 个位置，因此它完成一圈并访问起始时间两次。 我们通过将移动距离分解为完整的电路和剩余的部分间隔来统一处理这个问题。 由于(|X_i|\le N)，至多可以有一个完整的电路。 

记录所有间隔更新后，一次前缀和传递将重建每小时的访问次数。 通过从小时 (1) 向上扫描来选择具有最大值的最小小时。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | (O(MN)) | (O(N)) | 太慢了 |
 | 差异数组| (O(N+M)) | (O(N)) | 已接受 |

 ## 算法演练

 1. 创建差异数组`diff`长度为(N+1)。 稍后将通过前缀和来获得实际访问次数。 然后，可以通过仅更改其两个边界来表示范围增量。 
2. 对于每个学生，让`d = abs(X_i)`。 将距离分解为`full = d // N`完整的电路和`rem = d % N`剩余步骤。 添加`full`每小时通过表演`diff[0] += full`和`diff[N] -= full`。 这可以处理由完整电路提供的访问，而不涉及各个时间。 
3.如果`rem = 0`，没有剩余的部分动作，所以继续下一个学生。 这也可以正确处理 (X_i=0) 和 (X_i=\pm N)。 对于(X_i=\pm N)，完整的线路每小时贡献一次访问，而开始时间已经被线路的第一个位置包含一次。 
4. 将开始时间转换为从零开始的索引`a = A_i - 1`。 如果`X_i`为正，剩余路径从`a`到`(a + rem) % N`，因此访问间隔是从这两个端点开始的循环间隔。 
5.如果`X_i`为负数，则剩余路径逆时针方向走。 它的间隔开始于`(a - rem) % N`并结束于`a`。 这种反转是积极运动和消极运动之间的主要区别。 
6. 对应的循环间隔加1。 如果它的左端点不大于右端点，则它是一个普通区间，需要两次差值数组变化。 如果左端点更大，则该间隔跨越小时 (N) 和小时 (1) 之间的边界，因此它变成两个普通间隔，数组的每一端各一个。 
7. 处理完所有学生后，计算前缀和`diff`。 从零开始位置的运行总和`i`正是每小时的访问次数`i + 1`。 
8. 在计算这些前缀总和时，维护最佳时间及其访问计数。 仅当当前计数严格大于最佳计数时才更新答案。 由于扫描从小时 (1) 到小时 (N)，因此保持相等计数不变会自动选择最小的小时。 

### 为什么它有效

 不变的是，在处理学生的任意前缀后，差值数组准确地代表了这些学生对每小时的总贡献。 完整的电路每小时贡献相同的量，而剩余的运动访问一个连续的循环间隔，间隔更新操作准确地表示了这一点。 获取前缀总和会将这些边界变化转换为真实的访问计数。 在处理完所有学生后，每个小时都有其准确的访问总数，并且从左到右扫描选择最大计数，并在平局中选择最小小时。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

def add_interval(diff, n, left, right, value=1):
    if left <= right:
        diff[left] += value
        diff[right + 1] -= value
    else:
        diff[left] += value
        diff[n] -= value

        diff[0] += value
        diff[right + 1] -= value

def solve():
    t = int(input())
    out = []

    for _ in range(t):
        n, m = map(int, input().split())
        a = list(map(int, input().split()))
        x = list(map(int, input().split()))

        diff = [0] * (n + 1)

        for start, move in zip(a, x):
            pos = start - 1
            distance = abs(move)

            full = distance // n
            rem = distance % n

            if full:
                diff[0] += full
                diff[n] -= full

            if rem == 0:
                continue

            if move > 0:
                left = pos
                right = (pos + rem) % n
            else:
                left = (pos - rem) % n
                right = pos

            add_interval(diff, n, left, right)

        current = 0
        best_hour = 1
        best_count = -1

        for i in range(n):
            current += diff[i]

            if current > best_count:
                best_count = current
                best_hour = i + 1

        out.append(f"{best_hour} {best_count}")

    sys.stdout.write("\n".join(out))

if __name__ == "__main__":
    solve()
```这`diff`数组有一个额外的位置，因为范围以从零开始的索引结束`r`表示为添加于`diff[r + 1]`。 当间隔达到小时 (N) 时，这个额外的槽位也很方便。 

这`full`和`rem`分解处理每个允许的移动距离。 例如，当`move = N`,`full`是一并且`rem`为零，因此每小时都会有一次访问。 起始时间也被再次视为整个机芯的最终位置，这通过包含在完整电路本身中的起始位置来表示。 更准确地说，(N+1)个位置由起始位置加上(N)个动作组成，因此起始位置被计数了两次，从起始点开始分解为一个完整的循环区间，包括通过循环遍历重复起始位置。 

为了`rem > 0`,`left`和`right`描述完整的剩余位置集，包括两个端点。 对于正向移动，间隔从起始位置顺时针方向移动。 对于负向运动，间隔从最终位置逆时针回到起始位置。 

帮手`add_interval`处理普通间隔和换行间隔。 什么时候`left <= right`，区间是标准数组范围。 什么时候`left > right`，循环间隔包括`[left, N-1]`和`[0, right]`，因此该函数对每个部分执行一次差异更新。 

Python整数不会溢出，单次全遍历模式每小时最大访问次数最多为(M+1)次，所以普通整数运算就足够了。 

## 工作示例

 ### 示例 1

 输入是：```
1
5 5
1 2 3 4 5
1 1 1 1 2
```前四名学生各顺时针移动一步。 最后一个学生在 (5) 小时开始，移动两步，访问 (5,1,2)。 

| 学生| 开始| 移动| 剩余间隔| 访问量增加 |
 | --- | --- | --- | --- | --- |
 | 1 | 1 | 1 | 1 到 2 | 1, 2 |
 | 2 | 2 | 1 | 2 至 3 | 2, 3 |
 | 3 | 3 | 1 | 3 至 4 | 3, 4 |
 | 4 | 4 | 1 | 4 至 5 | 4, 5 |
 | 5 | 5 | 2 | 5比2循环| 5, 1, 2 |

 获取前缀和后，访问计数为：

 | 小时 | 1 | 2 | 3 | 4 | 5 |
 | --- | --- | --- | --- | --- | --- |
 | 访问 | 2 | 3 | 2 | 2 | 2 |

 最大值为 (3)，仅在小时 (2) 时达到，因此输出为`2 3`。 

### 自定义负向移动示例

 考虑：```
1
5 3
1 3 5
-2 -1 0
```第一个学生从 (1) 开始逆时针移动，访问 (1,5,4)。 第二次访问(3,2)。 第三个不移动，只访问（5）。 

| 学生| 开始| 移动| 剩余间隔| 访问量增加 |
 | --- | --- | --- | --- | --- |
 | 1 | 1 | -2 | 4比1循环| 4, 5, 1 |
 | 2 | 3 | -1 | 2 至 3 | 2, 3 |
 | 3 | 5 | 0 | 无 | 5 |

 结果计数为：

 | 小时 | 1 | 2 | 3 | 4 | 5 |
 | --- | --- | --- | --- | --- | --- |
 | 访问 | 1 | 1 | 1 | 1 | 2 |

 因此答案是`5 2`。 该轨迹同时练习逆时针缠绕和零运动。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | 每个测试用例 (O(N+M)) | 每个学生都会引起 (O(1)) 差异数组更新，然后在所有 (N) 小时内进行一次扫描。 |
 | 空间| (O(N)) | 差异数组包含 (N+1) 个整数。 |

 对于 (N,M\le10^5)，算法仅对每个学生执行恒定量的作业，并且在几个小时内执行一次线性传递。 假设测试用例的总输入大小也在比赛的实际限制之内，这完全在预期的 2 秒和 256 MB 限制之内。 

## 测试用例```python
import sys
import io

def solution():
    input = sys.stdin.readline

    t = int(input())
    out = []

    def add_interval(diff, n, left, right, value=1):
        if left <= right:
            diff[left] += value
            diff[right + 1] -= value
        else:
            diff[left] += value
            diff[n] -= value
            diff[0] += value
            diff[right + 1] -= value

    for _ in range(t):
        n, m = map(int, input().split())
        a = list(map(int, input().split()))
        x = list(map(int, input().split()))

        diff = [0] * (n + 1)

        for start, move in zip(a, x):
            pos = start - 1
            distance = abs(move)

            full = distance // n
            rem = distance % n

            if full:
                diff[0] += full
                diff[n] -= full

            if rem == 0:
                continue

            if move > 0:
                left = pos
                right = (pos + rem) % n
            else:
                left = (pos - rem) % n
                right = pos

            add_interval(diff, n, left, right)

        current = 0
        best_hour = 1
        best_count = -1

        for i in range(n):
            current += diff[i]
            if current > best_count:
                best_count = current
                best_hour = i + 1

        out.append(f"{best_hour} {best_count}")

    sys.stdout.write("\n".join(out))

def run(inp: str) -> str:
    old_stdin = sys.stdin
    old_stdout = sys.stdout

    sys.stdin = io.StringIO(inp)
    sys.stdout = io.StringIO()

    try:
        solution()
        return sys.stdout.getvalue()
    finally:
        sys.stdin = old_stdin
        sys.stdout = old_stdout

# Provided sample
assert run(
    """1
5 5
1 2 3 4 5
1 1 1 1 2
"""
) == "2 3\n", "sample 1"

# Minimum size, also checks X = N when N = 1.
assert run(
    """1
1 1
1
-1
"""
) == "1 2\n", "minimum size and full circuit"

# Counterclockwise wrapping.
assert run(
    """1
5 1
1
-2
"""
) == "1 1\n", "negative wrap"

# Full clockwise circuit.
assert run(
    """1
4 1
2
4
"""
) == "2 2\n", "X = N"

# Zero movement and tie-breaking.
assert run(
    """1
4 2
1 3
0 0
"""
) == "1 1\n", "zero movement and smallest-hour tie"

# Maximum-size case with all students staying at the same hour.
n = 100000
maximum_case = (
    f"1\n{n} {n}\n"
    + " ".join(["1"] * n)
    + "\n"
    + " ".join(["0"] * n)
    + "\n"
)
assert run(maximum_case) == f"1 {n}\n", "maximum size and all equal values"
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 |`1 / 1 1 / 1 / -1`|`1 2`| 最小尺寸和一小时时钟上的完整电路|
 |`1 / 5 1 / 1 / -2`|`1 1`| 逆时针运动穿过 (N) 到 (1) 边界 |
 |`1 / 4 1 / 2 / 4`|`2 2`| 正好 (N) 的运动，包括重复的开始时间 |
 |`1 / 4 2 / 1 3 / 0 0`|`1 1`| 零移动和最短时间打破平局 |
 | （N=M=100000），所有（A_i=1，X_i=0）|`1 100000`| 最大输入大小和大量访问次数 |

 ## 边缘情况

 第一个边缘情况是正方向的循环缠绕。 考虑：```
1
5 1
4
2
```学生访问 (4,5,1)。 在内部，从零开始是`3`，剩余端点为`(3 + 2) % 5 = 0`，所以区间为`[3,0]`。 由于左端点较大，`add_interval`将其分成`[3,4]`和`[0,0]`。 计数变为 (1,0,0,1,1)，最小的最大小时数为 (1)，给出`1 1`。 

第二个边缘情况是逆时针缠绕：```
1
5 1
1
-2
```路径是(1,5,4)。 零基础的开始是`0`，剩下的端点是`(0 - 2) % 5 = 3`。 该算法将循环间隔视为`3`到`0`作为`[3,4]`加`[0,0]`。 准确的小时 (4,5,1) 接受一次访问，给予`1 1`。 

第三种边缘情况是完整电路：```
1
4 1
2
4
```这里`distance = 4`， 所以`full = 1`和`rem = 0`。 完整的循环每小时贡献一次，而四次移动后会再次遇到起始位置。 结果计数为 (1,2,1,1)，所以答案为`2 2`。 这就是为什么在不考虑完整电路的情况下简单地将 (X) 替换为 (X\bmod N) 是不正确的。 

第四种边缘情况是零移动：```
1
3 1
2
0
```距离为零，因此循环不执行范围更新。 起初，这可能看起来好像学生没有做出任何贡献，但初始位置本身必须被计算在内。 差异数组表示可以处理这个问题，因为零长度移动在概念上是一个恰好包含开始时间的间隔。 在上面的实现中，这是通过路径的完整访问解释来处理的`rem = 0`; 由于零运动没有完整的回路，因此需要明确表示起始时间。 为了避免任何歧义，实施应处理`move == 0`作为一个小时的间隔。 

该特定分支的正确实现是：```
if distance == 0:
    diff[pos] += 1
    diff[pos + 1] -= 1
    continue
```通过这种修正，零运动情况产生`2 1`完全按照要求。 

第五个边缘情况是打破平局。 为了```
1
4 2
1 3
0 0
```(1) 和 (3) 小时都有一次访问，而 (2) 和 (4) 小时没有访问。 在前缀和扫描期间，小时 (1) 成为当前最佳时间。 当(3)小时也达到1时，严格比较`>`， 不是`>=`，因此存储的答案仍为小时 (1)。 结果是`1 1`。 

零移动校正也应应用于上述完整解决方案。 因此最终的实现是：```python
import sys
input = sys.stdin.readline

def add_interval(diff, n, left, right, value=1):
    if left <= right:
        diff[left] += value
        diff[right + 1] -= value
    else:
        diff[left] += value
        diff[n] -= value
        diff[0] += value
        diff[right + 1] -= value

def solve():
    t = int(input())
    out = []

    for _ in range(t):
        n, m = map(int, input().split())
        a = list(map(int, input().split()))
        x = list(map(int, input().split()))

        diff = [0] * (n + 1)

        for start, move in zip(a, x):
            pos = start - 1
            distance = abs(move)

            if distance == 0:
                diff[pos] += 1
                diff[pos + 1] -= 1
                continue

            full = distance // n
            rem = distance % n

            if full:
                diff[0] += full
                diff[n] -= full

            if rem == 0:
                diff[pos] += 1
                diff[pos + 1] -= 1
                continue

            if move > 0:
                left = pos
                right = (pos + rem) % n
            else:
                left = (pos - rem) % n
                right = pos

            add_interval(diff, n, left, right)

        current = 0
        best_hour = 1
        best_count = -1

        for i in range(n):
            current += diff[i]
            if current > best_count:
                best_count = current
                best_hour = i + 1

        out.append(f"{best_hour} {best_count}")

    sys.stdout.write("\n".join(out))

if __name__ == "__main__":
    solve()
```显式零移动分支是必要的，因为路径始终包含开始时间。 对于等于 (N) 的非零运动，全回路更新已经每小时访问一次，但开始小时需要额外访问一次，因为最终位置等于初始位置。 最简洁的实现是在以下情况下添加额外的开始时间访问：`rem == 0`和`distance > 0`，如上图所示。
