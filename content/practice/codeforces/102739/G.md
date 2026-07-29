---
title: "CF 102739G - \u041f\u043b\u0430\u043d \u0414"
description: "我们有 n 个独立的子任务，必须在连续 m 天内完成。 每个子任务都有一个允许的时间间隔：可以在 si 到 fi 的任何一天完成。"
date: "2026-07-29T01:09:36+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 102739
codeforces_index: "G"
codeforces_contest_name: "\u0421\u0438\u0440\u0438\u0443\u0441.2020.\u041d\u043e\u044f\u0431\u0440\u044c.\u041e\u0447\u043d\u044b\u0439 \u043e\u0442\u0431\u043e\u0440"
rating: 0
weight: 102739
solve_time_s: 61
verified: true
draft: false
---

[CF 102739G - \u041f\u043b\u0430\u043d \u0414](https://codeforces.com/problemset/problem/102739/G)

 **评级：** -
 **标签：** -
 **求解时间：** 1m 1s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们有`n`必须在期间完成的独立子任务`m`连续几天。 每个子任务都有一个允许的时间间隔：可以在任意一天完成`s_i`到`f_i`。 一个子任务正好以一天为单位，这意味着可以在同一天完成多个子任务，但我们希望每天的数量尽可能小。 

目标是找到一个时间表，其中每个子任务都分配给一个有效的一天，并且分配给任何一天的子任务的最大数量最小化。 输出是最小可能的最大负载，然后是各天中子任务的有效分配。 

限制最多允许`300000`子任务和`300000`天。 检查许多可能的分配的方法是不可能的，因为搜索空间呈指数增长。 即使是在每个可能的日子尝试每个子任务的模拟也需要大约`n * m`，这大约是`9 * 10^10`在最大的情况下进行操作。 我们需要一个接近的解决方案`O((n + m) log n)`或者`O((n + m) log^2 n)`。 

主要的困难不仅在于确定某个最大日负荷是否可能，而且还在于构建实际的时间表。 正确的解决方案必须处理严重重叠的时间间隔、没有可用任务的日子以及只有一天可能的任务。 

考虑一个单一任务：```
1 1
```一天可用。 答案是`1`，因为唯一的任务必须在第一天完成。 根据平均负载初始化答案的解决方案`ceil(n / m)`但忘记不可能的集中间隔在这种情况下可能会失败。 

另一个例子是：```
3 3
1 1
1 1
1 3
```正确答案是`2`。 前两项任务必须都放在第一天，因此不可能达到最大负载。 一种粗心的贪婪方法，只查看每天的任务总数而不考虑截止日期，可能会错误地声称每天一个任务就足够了。 

最后的边缘情况是：```
2 5
2 2
5 5
```答案是`1`。 第三天和第四天没有工作，但这并不重要。 每项任务只需要一个有效日。 意外地要求每天接收任务的实现将拒绝有效的计划。 

## 方法

 最直接的方法是尝试构建时间表，同时猜测每天允许的最大子任务数。 

假设我们知道答案最多是`x`。 我们可以通过从左到右扫过日子来测试这是否可能。 每个已到达开始日期的子任务都变得可用。 在所有可用的子任务中，我们应该始终选择那些最早完成的子任务。 这是标准的最早截止日期贪婪规则。 如果任务很快到期，推迟它是危险的，因为稍后的任务可能仍然具有更大的灵活性。 

对于固定的`x`，这种贪心检查是正确的，因为只要存在时间表，将具有最小截止日期的选定任务移至当天不会使未来的日子变得更困难。 我们首先使用最紧急的任务，因此不会不必要地丢失任何任务。 

然而，测试一个值`x`还不够。 我们需要最小的有效值。 答案是单调的：如果容量为`x`可以，那么任何更大的容量也可以。 这允许对答案进行二分搜索。 

暴力版本会尝试所有可能的容量并反复重建时间表。 尝试所有容量直至`n`会太慢，因为每次可行性检查都会花费`O((n + m) log n)`，给出关于`O(n(n + m) log n)`运营。 

关键的观察是可行性谓词是单调的。 二分查找将检查次数减少到大约`log n`，贪婪扫描在最终成功检查期间构造时间表。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | O(n(n + m) log n) | O(n(n + m) log n) | O(n + m) | 太慢了 |
 | 最佳| O((n + m) log n log n) | O((n + m) log n log n) | O(n + m) | 已接受 |

 ## 算法演练

 1. 按开始日期存储每个子任务。 在扫描过程中，这使我们能够快速发现当天哪些子任务可用。 
2.二分查找尽可能小的日容量`x`。 下界是`1`，上限为`n`，因为如果时间间隔允许的话，在一天内完成每个子任务始终是一个上限。 
3. 对于每个候选人的能力`x`，对所有日期执行从左到右的扫描。 添加所有子任务`s_i`等于当前日期放入最小堆中，排序方式为`f_i`。 
4. 当当天仍有未使用的容量时，重复从堆中删除完成日期最小的任务并将其分配给当天。 
5. 如果堆中包含完成日期小于当前日期的任务，则候选容量不可能。 这项任务已经错过了每一天。 
6. 处理完所有日期后，检查是否分配了每个任务。 如果是，则候选容量有效，我们将继续寻找更小的答案。 否则，我们会增加容量。 
7. 二分查找找到最小容量后，使用该容量最后一次运行贪婪构造并打印结果分配。 

为什么它有效：

 贪婪扫描期间的不变量是当前堆中的每个任务都在等待当前或未来的某一天。 首先选择最小的截止日期可以防止最严格的任务被延迟。 如果这个贪婪过程失败，则意味着某个任务没有剩余的有效位置，因此不存在具有测试容量的调度。 如果成功，则每项任务都已分配，同时遵守其间隔和每日限制。 然后，二分查找找到可以维持该不变量的最小容量。 

## Python 解决方案```python
import sys
import heapq

input = sys.stdin.readline

n, m = map(int, input().split())
by_start = [[] for _ in range(m + 2)]

for i in range(1, n + 1):
    s, f = map(int, input().split())
    by_start[s].append((f, i))

def check(cap, need_plan=False):
    heap = []
    ans = [[] for _ in range(m + 1)]
    done = 0

    for day in range(1, m + 1):
        for item in by_start[day]:
            heapq.heappush(heap, item)

        if heap and heap[0][0] < day:
            return None

        take = min(cap, len(heap))
        for _ in range(take):
            f, idx = heapq.heappop(heap)
            if need_plan:
                ans[day].append(idx)
            done += 1

        if heap and heap[0][0] < day:
            return None

    if done != n:
        return None

    if need_plan:
        return ans
    return True

lo, hi = 1, n
while lo < hi:
    mid = (lo + hi) // 2
    if check(mid):
        hi = mid
    else:
        lo = mid + 1

plan = check(lo, True)

out = [str(lo)]
for day in range(1, m + 1):
    out.append(str(len(plan[day])) + (" " + " ".join(map(str, plan[day])) if plan[day] else ""))

print("\n".join(out))
```数组`by_start`按任务可能出现的第一天对任务进行分组。 这避免了每天扫描所有任务。 

堆存储按完成日期排序的可用任务。 Python 按字典顺序比较元组，所以`(finish, index)`首先自动给出最早的截止日期，同时保持任务编号可用于输出。 

功能`check`用于二分搜索和生成最终答案。 在二分查找过程中，只需要知道某个容量是否有效，而最终的调用会记录所选的任务编号。 

接受任务之前和之后的截止日期检查可以防止错过的任务延续到以后的一天。 第二次检查很有用，因为在分配当天的任务后，下一个最小的截止日期可能仍然无效。 

不需要大整数运算，因为所有计数器最多`300000`。 

## 工作示例

 考虑这个输入：```
3 3
1 1
1 1
1 3
```二分查找最终考验的是能力`2`。 

| 日 | 可用任务| 添加后的堆 | 今天分配 |
 | --- | --- | --- | --- |
 | 1 | 1、2、3 | 1, 1, 3 | 1, 2 |
 | 2 | 无 | 3 | 3 |
 | 3 | 无 | 空 | 无 |

 前两项任务迫使容量至少为 2。 贪婪的选择会立即处理它们，因为它们的截止日期是最小的。 

再举个例子：```
2 5
2 2
5 5
```容量`1`经测试。 

| 日 | 可用任务| 堆| 已分配 |
 | --- | --- | --- | --- |
 | 1 | 无 | 空 | 无 |
 | 2 | 任务1 | 任务1 | 任务1 |
 | 3 | 无 | 空 | 无 |
 | 4 | 无 | 空 | 无 |
 | 5 | 任务2 | 任务2 | 任务2 |

 跟踪显示允许空天。 唯一的要求是每个任务都有一个有效日期。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | O((n + m) log n log n) | O((n + m) log n log n) | 每次二分搜索迭代都会执行一次堆扫描，并且有 O(log n) 次迭代。 |
 | 空间| O(n + m) | 任务桶、堆和最终调度都最多存储线性信息。 |

 最大输入大小为`300000`，因此该算法仅执行对数次线性堆扫描。 这完全符合预期的限制。 

## 测试用例```python
import sys
import io

def solve(data):
    old = sys.stdin
    sys.stdin = io.StringIO(data)
    input = sys.stdin.readline

    n, m = map(int, input().split())
    by_start = [[] for _ in range(m + 2)]

    for i in range(1, n + 1):
        s, f = map(int, input().split())
        by_start[s].append((f, i))

    import heapq

    def check(cap, plan=False):
        heap = []
        ans = [[] for _ in range(m + 1)]
        cnt = 0

        for day in range(1, m + 1):
            for x in by_start[day]:
                heapq.heappush(heap, x)

            if heap and heap[0][0] < day:
                return None

            for _ in range(min(cap, len(heap))):
                f, idx = heapq.heappop(heap)
                if plan:
                    ans[day].append(idx)
                cnt += 1

        if cnt != n:
            return None
        return ans if plan else True

    lo, hi = 1, n
    while lo < hi:
        mid = (lo + hi) // 2
        if check(mid):
            hi = mid
        else:
            lo = mid + 1

    res = check(lo, True)
    out = [str(lo)]
    for i in range(1, m + 1):
        out.append(str(len(res[i])) + (" " + " ".join(map(str, res[i])) if res[i] else ""))

    sys.stdin = old
    return "\n".join(out)

assert solve("""3 3
1 1
1 1
1 3
""").splitlines()[0] == "2"

assert solve("""2 5
2 2
5 5
""").splitlines()[0] == "1"

assert solve("""1 1
1 1
""").splitlines()[0] == "1"

assert solve("""5 5
1 5
1 5
1 5
1 5
1 5
""").splitlines()[0] == "1"

assert solve("""4 4
1 2
1 2
3 4
3 4
""").splitlines()[0] == "1"
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 | 三任务两定为一天| 2 | 强制重叠和截止日期处理 |
 | 两个孤立的单日任务 | 1 | 空虚的日子和稀疏的间隔|
 | 一日一任务| 1 | 最小尺寸外壳 |
 | 五个相同的全方位任务 | 1 | 灵活的时间间隔 |
 | 两组不相交的区间| 1 | 正确处理独立范围 |

 ## 边缘情况

 对于：```
1 1
1 1
```堆在第一天收到唯一的任务并立即分配它。 二分查找不能将容量减少到1以下，所以答案是正确的。 

为了：```
3 3
1 1
1 1
1 3
```容量一项检查失败。 在第一天，贪婪算法必须放置在第一天结束的两个任务之一，但保留具有相同截止日期的另一个任务。 当第二天开始时，剩余的任务已经到期。 能力二成功是因为两项紧急任务都得到了立即处理。 

为了：```
2 5
2 2
5 5
```该算法将第一天、第三天和第四天留空。 堆仅包含允许日期的任务，因此不会尝试无效分配。 

对于涵盖每天的间隔，例如：```
5 5
1 5
1 5
1 5
1 5
1 5
```贪心算法可以将任务分散到不同的日子。 这说明了为什么答案取决于间隔限制而不仅仅是任务数量。 

如果您愿意，我还可以将这篇社论改编成更短的 Codeforces 风格版本，重点关注核心思想和证明。
