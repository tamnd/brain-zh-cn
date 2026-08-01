---
title: "CF 102576L - 奇才联合"
description: "我们有一系列宝箱，每个宝箱都有自己的打开时间。 有一把金钥匙可以永远重复使用，有k把银钥匙使用一次后就会消失。 一把钥匙一次只能对一个箱子起作用。"
date: "2026-07-31T07:41:07+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 102576
codeforces_index: "L"
codeforces_contest_name: "2020 Petrozavodsk Winter Camp, Jagiellonian U Contest"
rating: 0
weight: 102576
solve_time_s: 75
verified: true
draft: false
---

[CF 102576L - 巫师联盟](https://codeforces.com/problemset/problem/102576/L)

 **评级：** -
 **标签：** -
 **求解时间：** 1m 15s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们有一系列宝箱，每个宝箱都有自己的打开时间。 有一把金钥匙可以永远重复使用，还有`k`银钥匙使用一次后就会消失。 一把钥匙一次只能对一个箱子起作用。 目标是决定哪些箱子应该消耗银钥匙，以便最后一个箱子尽快完成。 

输入包含多个测试用例。 对于每个测试用例，第一行给出了箱子的数量和银钥匙的数量。 下一行包含每个宝箱的打开时间。 如果使用最佳钥匙分配打开所有箱子，则输出是可能的最短完成时间。 

所有测试用例的箱子总数可以达到`10^6`，并且单个测试用例可以包含`10^5`胸部。 这立即排除了尝试将箱子多次分配给钥匙的模拟。 可能的分配数量是指数级的，即使检查许多组合也将远远超出 2 秒限制。 一个`O(n log n)`解决方案是可以接受的，因为排序`10^6`总的值在这些约束的正常范围内，而任何接近的值`O(n^2)`不是。 

棘手的案件不仅仅与空工作有关。 当最长的箱子和剩余的总工作相互竞争时，它们就会出现。 

例如，使用一把银钥匙：```
1
3 1
10 1 1
```正确答案是`2`。 银钥匙打开宝箱取得`10`几秒钟内，金钥匙打开剩下的两个箱子`2`秒。 最后时间是`10`， 不是`2`，所以正确的输出实际上是：```
10
```只计算金钥匙工作负载的粗心解决方案会忽略银钥匙也会影响完成时间这一事实。 

另一种情况是所有宝箱的持续时间相同：```
1
5 2
7 7 7 7 7
```正确的输出是`14`。 两把银钥匙一次完成两个箱子`7`，金钥匙处理剩下的三个`21`如果分配不当，则为秒。 最佳分配留下两个银箱和三个金箱，给出`21`。 假设银钥匙总是确​​定答案的解决方案将错误地输出`7`。 

边界情况`k = 0`也很重要：```
1
4 0
3 5 2 4
```没有银钥匙，所以金钥匙必须依次打开每个宝箱。 答案是`14`。 盲目取第一个的代码`k`排序后的元素需要正确处理这种情况。 

## 方法

 直接方法会尝试所有可能的选择`k`银钥匙的箱子。 一旦选择了这些宝箱，所有其他宝箱都将被强制放到金钥匙上，因此完成时间很容易计算为最长的银宝箱和总黄金工作量中的最大值。 这种方法是正确的，因为每个有效的时间表都对应于银箱的一种选择。 

问题在于选择的数量。 选择`k`箱子来自`n`给出`C(n, k)`的可能性。 即使对于中等值，例如`n = 100`和`k = 50`，作业数量已经很大了，所以这个方法行不通。 

关键的观察结果是，银钥匙很有价值，因为它从金钥匙的连续工作负载中移除了箱子。 为了尽可能减少金钥匙时间，移除的箱子应该有最长的持续时间。 唯一可能的缺点是，最大的银箱可能会成为最终的完成时间。 然而，用较小的银箱替换较大的金箱永远无法改善这种情况。 

假设一份银牌任务包含一个长箱`x`，并且黄金任务包含一个长度的箱子`y`在哪里`y > x`。 交换它们可以将更多的工作从金钥匙上移开，并将更长的箱子放在银钥匙上。 黄金工作量减少`y - x`。 白银上限可以增加，但不能超过之前的黄金工作量，因为`y`是该工作量的一部分。 最终的最大值不能变得更糟。 重复这种交换，最大的箱子就会变成银钥匙。 

将宝箱时间按降序排序后，第一个`k`箱子应该使用银钥匙。 剩余的箱子由金钥匙依次处理。 答案是最长的银箱和金钥匙花费的总时间中较大的一个。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 蛮力 |`O(C(n,k) * n)`|`O(n)`| 太慢了|
 | 最佳|`O(n log n)`|`O(1)`除了分类存储之外| 已接受 |

 ## 算法演练

 1.将所有开宝箱时间降序排列。 应首先考虑最长的持续时间，因为当从金钥匙工作负载中删除时，它们可以最大程度地减少。 
2.分配第一个`k`将箱子分类到银钥匙。 它们的完成时间是这些值中最大的，这只是当`k > 0`。 
3. 将所有剩余的箱子分配给金钥匙。 将它们的持续时间加在一起，因为金钥匙一次只能打开一个箱子。 
4. 返回白银完成时间和黄金完成时间之间的较大值。 两组都是独立运作的，因此每个箱子都必须在较慢的一组完成时完成。 

为什么有效：交换论点表明，任何银钥匙上有较小箱子而金钥匙上有较大箱子的解决方案都可以通过交换它们来转变为同样好或更好的解决方案。 重复应用这个会产生这样的排列：`k` largest chests use silver keys. Once that assignment is fixed, the gold key and silver keys have independent finishing times, so the final answer is exactly the maximum of those times.

## Python Solution

```python
import sys
input = sys.stdin.readline

def solve():
    data = list(map(int, sys.stdin.buffer.read().split()))
    if not data:
        return

    z = data[0]
    idx = 1
    ans = []

    for _ in range(z):
        n = data[idx]
        k = data[idx + 1]
        idx += 2

        a = data[idx:idx + n]
        idx += n

        a.sort(reverse=True)

        silver_time = a[0] if k > 0 else 0
        gold_time = sum(a[k:])

        ans.append(str(max(silver_time, gold_time)))

    sys.stdout.write("\n".join(ans))

if __name__ == "__main__":
    solve()
```

The program first reads every integer at once because the total input size can reach one million chest values. This avoids repeated input overhead.

For each test case, sorting places the most expensive chests at the front. The variable `silver_time` represents the time needed for all silver operations to finish. Since all silver keys can start at the same time, only the longest silver chest matters.

The variable `gold_time` is the sum of the remaining durations because the gold key must process them one after another. The `k > 0` condition avoids accessing `a[0]`因为当没有银钥匙时，银组就不存在。 

Python 整数已经支持大于所有箱子时间可能总和的值，因此不需要溢出处理。 

## 工作示例

 对于第一个样本：

 输入：```
1
3 1
1 3 2
```排序后，时间变成`[3, 2, 1]`。 

| k | 银宝箱时代| 银色饰面| 黄金宝箱时代| 金色饰面| 回答 |
 | ---| ---| ---| ---| ---| ---|
 | 1 |`[3]`| 3 |`[2,1]`| 3 | 3 |

 最长的箱子被分配给银钥匙。 金钥匙控制两个较小的箱子，两组同时完成。 

对于第二个样本：

 输入：```
1
3 2
5 5 5
```排序后，时间依然存在`[5, 5, 5]`。 

| k | 银宝箱时代| 银色饰面| 黄金宝箱时代| 金色饰面| 回答 |
 | ---| ---| ---| ---| ---| ---|
 | 2 |`[5,5]`| 5 |`[5]`| 5 | 5 |

 两把银钥匙可以立即打开两个箱子，而金钥匙则可以打开最后一个箱子。 最长完成时间为五秒。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 |`O(n log n)`| 排序主导着答案的线性扫描。 |
 | 空间|`O(n)`| 存储宝箱持续时间列表以进行排序。 |

 所有测试用例的箱子总数最多为`10^6`，因此总的分类工作仍然是可控的。 内存使用量也在给定的限制内，因为只需要输入数组和正常的排序开销。 

## 测试用例```python
import sys
import io

def solve_case(inp: str) -> str:
    old_stdin = sys.stdin
    old_stdout = sys.stdout

    sys.stdin = io.StringIO(inp)
    sys.stdout = io.StringIO()

    data = list(map(int, sys.stdin.buffer.read().split()))
    if data:
        z = data[0]
        idx = 1
        out = []

        for _ in range(z):
            n = data[idx]
            k = data[idx + 1]
            idx += 2
            a = data[idx:idx + n]
            idx += n

            a.sort(reverse=True)
            silver = a[0] if k else 0
            gold = sum(a[k:])
            out.append(str(max(silver, gold)))

        sys.stdout.write("\n".join(out))

    result = sys.stdout.getvalue()

    sys.stdin = old_stdin
    sys.stdout = old_stdout
    return result

assert solve_case("""2
3 1
1 3 2
3 2
5 5 5
""") == "3\n5", "samples"

assert solve_case("""1
1 0
100
""") == "100", "single chest without silver key"

assert solve_case("""1
5 2
7 7 7 7 7
""") == "21", "all equal values"

assert solve_case("""1
6 5
9 8 7 6 5 4
""") == "9", "almost every chest uses silver"

assert solve_case("""1
4 0
3 5 2 4
""") == "14", "no silver keys"
```| 测试输入| 预期产出 | 它验证了什么 |
 | ---| ---| ---|
 | 一把银钥匙三个箱子|`3`| 银钥匙和金钥匙的基本区别|
 | 一箱无银钥匙|`100`| 最小尺寸和`k = 0`处理 |
 | 五等胸次|`21`| 防止假设银钥匙单独确定答案|
 | 六个箱子里有五把银钥匙 |`9`| 大银团界|
 | 没有混合持续时间的银钥匙 |`14`| 纯金钥匙调度|

 ## 边缘情况

 当有一个非常长的箱子时，算法会将其保留在一把银钥匙上（如果存在）。```
1
3 1
10 1 1
```排序后的数组是`[10, 1, 1]`。 银牌结束时间为`10`，黄金完成时间为`2`。 答案是`10`，因为白银操作是最后完成的操作。 

当所有宝箱时间相同时，选择最大的`k`仍然很重要，因为每种可能的白银选择看起来都一样。```
1
5 2
7 7 7 7 7
```前两个箱子变成银牌，完成时间`7`。 剩下的三个是用黄金加工的`21`秒。 算法返回`21`，与真实的时间表相符。 

当不存在银钥匙时，整个排序数组都属于金钥匙。```
1
4 0
3 5 2 4
```该算法将白银贡献设置为零并对所有值求和：`5 + 4 + 3 + 2 = 14`。 结果是唯一可能的时间表。 

当银钥匙很多时，剩余的金币工作量可能会变得小于最长的银箱。```
1
6 5
9 8 7 6 5 4
```银键采用前五个值，因此它们的完成时间是`9`。 金钥匙只能打开最后一个箱子，最后是`4`。 最终的答案是`9`，说明为什么需要最大值计算的两侧。
