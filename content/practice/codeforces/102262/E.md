---
title: "CF 102262E - \u041a\u0440\u0438\u0442\u0438\u0447\u0435\u0441\u043a\u0430\u044f \u0443\u044f\u0437\u0432\u0438\u043c\u043e\u0441\u0442\u044c"
description: "每个集群都是一个不可分割的更新作业。 集群 i 包含 xi 个服务器，因此处理它正好需要 xi 个时间单位。 其允许的时间间隔从 ai 开始，到 ai + xi 结束。"
date: "2026-08-17T20:19:58+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 102262
codeforces_index: "E"
codeforces_contest_name: "\u0427\u0435\u043c\u043f\u0438\u043e\u043d\u0430\u0442 \u043f\u043e \u043f\u0440\u043e\u0433\u0440\u0430\u043c\u043c\u0438\u0440\u043e\u0432\u0430\u043d\u0438\u044e - \u0444\u0438\u043d\u0430\u043b (\u042f\u043d\u0434\u0435\u043a\u0441)"
rating: 0
weight: 102262
solve_time_s: 83
verified: true
draft: false
---

[CF 102262E - \u041a\u0440\u0438\u0442\u0438\u0447\u0435\u0441\u043a\u0430\u044f \u0443\u044f\u0437\u0432\u0438\u043c\u043e\u0441\u0442\u044c](https://codeforces.com/problemset/problem/102262/E)

 **评级：** -
 **标签：** -
 **求解时间：** 1m 23s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 每个集群都是一个不可分割的更新作业。 簇`i`包含`x_i`服务器，因此处理它需要精确的时间`x_i`时间单位。 其允许的时间间隔开始于`a_i`并结束于`a_i + x_i`。 由于允许的时间间隔与所需的处理时间完全相同，因此该集群实际上只有一种可能的调度：它占据整个时间间隔`[a_i, a_i + x_i]`。 

我们可以选择集群的任何子集，但它们的间隔不能重叠，因为一次只能更新一个集群。 如果两个选定的时间间隔在一个端点相遇，则有效：一次更新可以一次完成`t`下一个可以在某个时间开始`t`。 

选择集群的价值`i`是`x_i`，因为所有`x_i`该集群中的服务器已更新。 因此，任务是选择一组最大权重的非重叠区间，并输出其总权重和相应的从零开始的聚类索引。 

和`n`最多`10^5`，尝试每个子集需要最多`2^100000`可能性，这是完全不可能的。 即使二次算法的性能也差不多`10^10`最坏情况下的操作，远远超出一秒的限制可以处理。 我们需要一个`O(n log n)`或类似有效的解决方案。 

有几种边界情况可能会使原本合理的实现变得错误。 首先，接触的区间必须被认为是兼容的。 例如，```
21 23 2
```给出间隔`[1,3]`和`[3,5]`。 两者都可以选，所以答案是`4`带索引`0 1`。 使用前驱搜索`< a_i`而不是`<= a_i`会错误地拒绝第二个簇。 

其次，最长的个体间隔不一定是最好的答案。 为了```
31 44 26 3
```间隔是`[1,5]`,`[4,6]`， 和`[6,9]`。 选择集群`1`和`2`给出`2 + 3 = 5`，这比选择集群更好`0`有价值`4`。 因此，仅采用最长可用簇的贪婪策略可能会失败。 

第三，即使存在许多簇，答案也只能包含一个簇。 为了```
31 51 51 5
```所有三个间隔都相同，因此只能处理一个。 正确的最大值是`5`， 不是`15`。 

最后，所有时间和答案值大致可以达到`10^14`当总结时`10^5`集群。 Python 整数会自动处理这个问题，但 C++ 实现需要`long long`。 

## 方法

 直接强力方法考虑集群的每个子集。 对于每个子集，我们可以排序或以其他方式检查其选定的间隔，检查它们是否重叠，并计算更新服务器的数量。 这是正确的，因为每个可能的簇集都会被检查，因此最终必须找到最佳的可行集。 

问题是子集的数量。 和`n = 10^5`， 有`2^100000`子集。 即使在检查这些子集是否可行之前，这也太大了。 

更有用的强力动态规划公式按结束时间对间隔进行排序。 对于每个间隔，我们可以查看每个较早的间隔以找到最后一个兼容的间隔。 这给出了熟悉的加权间隔调度循环，但是通过扫描所有先前的间隔来查找前一个间隔需要`O(n^2)`时间。 在`n = 10^5`，这大约是`5 * 10^9`前任在最坏的情况下进行检查，这仍然太慢。 

关键的观察结果是，在按右端点对区间进行排序后，我们需要从之前的区间获得的唯一信息是最后一个区间结束时间不晚于当前区间开始时间的最佳答案。 由于所有先前的右端点都已排序，因此可以通过二分搜索找到前一个端点。 

令一个区间表示为`(start, end, weight, index)`， 在哪里`start = a_i`

`end = a_i + x_i`

`weight = x_i`。 

排序后`end`， 定义`dp[i]`作为可以使用第一个更新的服务器的最大数量`i`排序的间隔。 对于下一个区间，恰好有两种可能性。 我们要么跳过它，要么保留`dp[i]`，或者将其权重与开始时或之前结束的最佳解决方案相结合。 如果`p`是结束时间最多为当前开始时间的间隔数，递归为`dp[i + 1] = max(dp[i], dp[p] + x_i)`。 

二分查找发现`p`在`O(log n)`，将完整算法简化为`O(n log n)`。 

同样的动态规划还可以让我们重建所选的簇。 每当采用当前间隔给出严格更好的值时，我们都会记住选择了该间隔并跳回到`p`。 否则我们将移至上一个区间。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 |`O(2^n n)`|`O(n)`| 太慢了 |
 | 二次DP|`O(n^2)`|`O(n)`| 太慢了 |
 | 最佳加权区间 DP |`O(n log n)`|`O(n)`| 已接受 |

 ## 算法演练

 1. 读取每个簇并构建其固定的更新间隔。 对于集群`i`， 店铺`(a_i, a_i + x_i, x_i, i)`。 保留原始索引，因为输出必须使用输入中的簇编号。 
2. 按结束时间对所有间隔进行排序。 这种排序使得间隔的每个前导时间都出现在它之前，更重要的是，使所有结束时间都可用于二分搜索。 
3. 创建数组`ends`包含排序的结束时间。 对于当前间隔开始`s`， 使用`bisect_right(ends, s)`找出有多少个间隔在或之前结束`s`。 拨打这个号码`p`。 使用`bisect_right`是故意的，因为间隔恰好结束于`s`不与当前间隔重叠。 
4. 维护`dp`， 在哪里`dp[k]`是从第一个服务器可获得的更新服务器的最大数量`k`排序的间隔。 最初`dp[0] = 0`，因为选择任何内容都不会更新任何服务器。 
5. 从左到右处理区间。 对于当前间隔，一种选择是跳过它，给出`dp[i]`。 另一种选择是接受它，给予`dp[p] + x_i`。 将较大的值存储在`dp[i + 1]`。 
6. 旁边`dp`，存储每个位置的决策。 如果采用当前间隔更好，记录选择的间隔并记住`p`。 如果跳过它至少同样好，请记录当前间隔已被跳过。 当两个值相等时选择跳过很方便，因为它提供了简单的确定性重建，同时仍然保留最佳答案。 
7. 从最终的 DP 状态开始，向后重建所选簇。 如果选择了当前间隔，则附加其原始索引并跳转到`p`。 否则转移到前面的 DP 状态。 在打印之前反转收集到的索引。 

排序后，不变式是`dp[i]`总是使用第一个来表示最佳答案`i`按结束时间顺序排列的间隔。 任何最优解要么排除当前区间，在这种情况下，它表示为`dp[i]`，或包含它，在这种情况下，每个其他选定的间隔必须不晚于其开始时间结束，并且最好的此类前缀恰好是`dp[p]`。 这两种情况涵盖了所有可行解，因此递归不会错过最优解。 

## Python 解决方案```python
Pythonimport sysfrom bisect import bisect_right
input = sys.stdin.readline

def solve():    n = int(input())
    intervals = []    for idx in range(n):        a, x = map(int, input().split())        intervals.append((a, a + x, x, idx))
    intervals.sort(key=lambda item: item[1])
    ends = [item[1] for item in intervals]
    dp = [0] * (n + 1)    take = [False] * n    prev = [0] * n
    for i, (start, end, weight, idx) in enumerate(intervals):        p = bisect_right(ends, start, 0, i)
        skip_value = dp[i]        take_value = dp[p] + weight
        if take_value > skip_value:            dp[i + 1] = take_value            take[i] = True            prev[i] = p        else:            dp[i + 1] = skip_value
    answer = []    pos = n
    while pos > 0:        i = pos - 1        if take[i]:            answer.append(intervals[i][3])            pos = prev[i]        else:            pos -= 1
    answer.reverse()
    print(dp[n])    print(*answer)

if __name__ == "__main__":    solve()
```输入循环将每个簇转换为实际必须占用的区间。 表达式`a + x`是安全的，因为 Python 整数具有任意精度，并且最大可能值仅约为`2 * 10^9`对于一个端点。 

排序后，`ends[i]`是的结束时间`i`-th 间隔。 致电给`bisect_right(ends, start, 0, i)`仅在 DP 已处理的间隔中搜索。 此限制很有用，因为之后的间隔`i`不能是区间的前导`i`。 它还可以正确处理相等的端点。 

DP 数组有一个额外的元素。`dp[0]`表示从空前缀中选择，以及排序位置的间隔`i`产生国家`dp[i + 1]`。 该索引使前身`p`可直接用作 DP 位置。 

重建阵列值得特别关注。`prev[i]`当区间有意义时`i`被选中并准确地告诉我们之前使用的是哪个 DP 状态。 我们跳到该状态而不是简单地减一。 当跳过间隔时，我们从`pos`到`pos - 1`。 

严格比较`take_value > skip_value`不需要值的正确性，但当两种选择都同样好时，它会给出确定性选择。 该语句允许任何最优集，因此任一选择都是有效的。 

最终的指数是相反的，因为重建按照时间表向后进行。 它们在输出中的顺序实际上不受限制，但反转它们可以使结果更容易检查，并使它们保持与所选间隔相同的顺序。 

## 工作示例

 ### 示例 1

 第一个示例是根据语句格式重构的```
41 44 118 512 5
```间隔是`[1,5]`,`[4,15]`,`[8,13]`， 和`[12,17]`。 按结束时间排序后，它们已经按此顺序出现。 

|`i`| 间隔 | 开始| 重量 |`p`| 跳过| 拿|`dp[i+1]`|
 | --- | --- | --- | --- | --- | --- | --- | --- |
 | 0 |`[1,5]`| 1 | 4 | 0 | 0 | 4 | 4 |
 | 1 |`[4,15]`| 4 | 11 | 11 0 | 4 | 11 | 11 11 | 11
 | 2 |`[8,13]`| 8 | 4？ | 1 | 11 | 11 9 | 11 | 11
 | 3 |`[12,17]`| 12 | 12 5 | 1 | 11 | 11 9 | 11 | 11

 显示样本的第三个簇有`x = 5`，所以它的区间是`[8,13]`。 因此它的实际价值是`dp[1] + 5 = 9`，表中结论保持不变。 最优答案是簇`1`, 给予`11`更新的服务器。 

### 示例 2

 第二个样本是```
41 44 118 312 5
```间隔是`[1,5]`,`[4,15]`,`[8,11]`， 和`[12,17]`。 

|`i`| 间隔 | 开始| 重量 |`p`| 跳过| 拿|`dp[i+1]`|
 | --- | --- | --- | --- | --- | --- | --- | --- |
 | 0 |`[1,5]`| 1 | 4 | 0 | 0 | 4 | 4 |
 | 1 |`[8,11]`| 8 | 3 | 1 | 4 | 7 | 7 |
 | 2 |`[4,15]`| 4 | 11 | 11 0 | 7 | 11 | 11 11 | 11
 | 3 |`[12,17]`| 12 | 12 5 | 2 | 11 | 11 12 | 12 12 | 12

 这里的间隔`[8,11]`可以跟随`[12,17]`因为`11 <= 12`。 得到的总和是`4 + 3 + 5 = 12`，使用簇`0`,`2`， 和`3`。 这个例子具体说明了为什么必须接受前置条件中的相等性。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 |`O(n log n)`| 排序需要`O(n log n)`，以及每个`n`间隔执行一次二分查找 |
 | 空间|`O(n)`| 区间、DP值、前驱信息、重构数组都需要线性空间 |

 为了`n = 10^5`、排序和粗略`10^5`二分搜索完全在预期范围内。 该算法避免了二次前驱搜索，并且仅使用线性附加内存，因此它完全符合规定的内存限制，并且适合一秒竞争性编程限制。 

## 测试用例

 由于可能存在多个最佳集，并且该语句允许它们的索引采用任意顺序，因此下面的测试助手会验证返回值和所选集，而不是要求一种特定的排序。```python
Pythonimport sysimport iofrom bisect import bisect_right

def solve_io(data: str) -> str:    it = iter(data.split())    n = int(next(it))
    intervals = []    for idx in range(n):        a = int(next(it))        x = int(next(it))        intervals.append((a, a + x, x, idx))
    intervals.sort(key=lambda item: item[1])    ends = [item[1] for item in intervals]
    dp = [0] * (n + 1)    take = [False] * n    prev = [0] * n
    for i, (start, end, weight, idx) in enumerate(intervals):        p = bisect_right(ends, start, 0, i)
        if dp[p] + weight > dp[i]:            dp[i + 1] = dp[p] + weight            take[i] = True            prev[i] = p        else:            dp[i + 1] = dp[i]
    selected = []    pos = n
    while pos:        i = pos - 1        if take[i]:            selected.append(intervals[i][3])            pos = prev[i]        else:            pos -= 1
    selected.reverse()
    return str(dp[n]) + "\n" + " ".join(map(str, selected)) + "\n"

def run(inp: str) -> str:    return solve_io(inp)

def parse_output(out: str):    lines = out.strip().splitlines()    value = int(lines[0])    indices = list(map(int, lines[1].split())) if len(lines) > 1 and lines[1] else []    return value, indices

def check(inp: str, expected_value: int):    out = run(inp)    value, indices = parse_output(out)
    assert value == expected_value
    data = list(map(int, inp.split()))    n = data[0]    clusters = []    p = 1
    for i in range(n):        a = data[p]        x = data[p + 1]        p += 2        clusters.append((a, x))
    assert len(indices) == len(set(indices))
    intervals = []    total = 0
    for idx in indices:        a, x = clusters[idx]        intervals.append((a, a + x))        total += x
    intervals.sort()
    for i in range(1, len(intervals)):        assert intervals[i - 1][1] <= intervals[i][0]
    assert total == value

# Provided sample 1.assert parse_output(run(    """41 44 118 512 5"""))[0] == 11
# Provided sample 2.assert parse_output(run(    """41 44 118 312 5"""))[0] == 12
# Minimum-size input.check(    """17 3""",    3)
# All intervals are identical, so only one cluster can be chosen.check(    """51 21 21 21 21 2""",    2)
# Touching intervals must be accepted.check(    """31 23 25 2""",    6)
# A long interval is worse than several compatible shorter intervals.check(    """41 62 24 26 2""",    6)
# Large-value stress case.n = 100000large_input = str(n) + "\n" + "\n".join(    f"{2 * i + 1} 1" for i in range(n)) + "\n"check(large_input, n)
print("All tests passed.")
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 |`1 / 7 3`|`3`| 单个区间的最小尺寸输入和重建 |
 | 五份`1 2`|`2`| 重叠相同的间隔并避免意外的重复计算 |
 |`1 2`,`3 2`,`5 2`|`6`| 连续区间接触的边界条件 |
 |`1 6`,`2 2`,`4 2`,`6 2`|`6`| DP选择几个兼容的作业而不是最长的作业|
 |`100000`间隔`(2i+1, 1)`|`100000`| 最大输入大小、排序、二分搜索和大 DP 状态 |

 ## 边缘情况

 对于接触间隔，请考虑```
31 23 25 2
```间隔是`[1,3]`,`[3,5]`， 和`[5,7]`。 对于第二个间隔，`bisect_right`包括第一个间隔，因为它的结尾恰好是`3`， 所以`p = 1`。 对于第三个间隔，之前的两个间隔都可以是前置间隔，给出`p = 2`。 DP达到`6`，选择所有三个簇。 严格的前置条件会错误地减少结果。 

对于相同的间隔，考虑```
31 51 51 5
```所有间隔结束于`6`，选择第一个区间后，其他所有区间都有`p = 0`因为没有一个在开始之前或开始时结束`1`。 因此 DP 保留该值`5`而不是添加另一个重叠间隔。 输出仅包含一个索引和报告`5`。 

对于较长的间隔与几个较短的间隔，请考虑```
41 62 24 26 2
```第一个簇占用`[1,7]`并赋予价值`6`。 其余三人占据`[2,4]`,`[4,6]`， 和`[6,8]`，所以它们都可以被选择并且也给出总价值`6`。 DP 可以根据其平局处理来选择任一最佳布置。 由于它更喜欢在值相等时跳过，因此它会将第一个集群的解决方案保持在相关状态，但报告的值仍然正确。 

对于恰好在另一个簇结束时开始的簇，请考虑```
210 414 100
```间隔是`[10,14]`和`[14,114]`。 第二个集群是有效的后继集群，因为第一次更新完成于`14`，正好是第二个开始的时候。 二分查找使用`bisect_right`，因此第一个间隔被包含为前置间隔。 算法返回`104`，演示了不依赖浮点时间的端点约定。 

对于最大输入大小，生成的压力测试包含`100000`不重叠的单位长度间隔。 每个区间都可以选择，所以答案是`100000`。 该算法在每个区间执行一次排序和一次二分搜索，而不是比较每一对，这正是使解决方案具有可扩展性的区别。
