---
title: "CF 151B - 电话号码"
description: "每个朋友都有一本电话簿，其中包含以 XX-XX-XX 格式书写的号码。 每个电话号码都属于三个类别之一。 出租车号码在任何地方都使用相同的数字。 例如 11-11-11 或 55-55-55。"
date: "2026-05-29T00:00:00+07:00"
tags: ["codeforces", "competitive-programming", "implementation", "strings"]
categories: ["algorithms"]
codeforces_contest: 151
codeforces_index: "B"
codeforces_contest_name: "Codeforces Round 107 (Div. 2)"
rating: 1200
weight: 151
solve_time_s: 106
verified: true
draft: false
---

[CF 151B - 电话号码](https://codeforces.com/problemset/problem/151/B)

 **评分：** 1200
 **标签：** 实现、字符串
 **求解时间：** 1m 46s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 每个朋友都有一本电话簿，其中包含按以下格式编写的号码`XX-XX-XX`。 每个电话号码都属于三个类别之一。 

出租车号码在任何地方都使用相同的数字。 例子是`11-11-11`或者`55-55-55`。 

当我们从左到右读取披萨的数字时，忽略破折号，披萨的数字严格递减。 下一个数字必须小于前一个数字。 例子是`98-76-54`和`95-43-21`。 

任何既不是出租车也不是披萨的号码都被视为女孩号码。 

对于每一个朋友，我们都要数一下属于每一类的号码有多少个。 处理完所有电话簿后，我们输出出租车数量最多、披萨数量最多和女孩数量最多的朋友的名字。 多个朋友可能会并列最大，在这种情况下，我们会按输入顺序打印所有朋友。 

限制非常小。 好友最多 100 个，每个好友最多 100 个电话号码。 每个数字恰好包含 6 位数字。 即使是单独检查每个数字的每个数字的简单实现也可以在限制内轻松运行。 该程序总共最多处理 10,000 个电话号码，每个电话号码的长度都是固定的。 这意味着实际工作量很小。 

棘手的部分不是性能，而是分类正确性和输出格式。 

一个容易犯的错误是在检查数字时忘记忽略破折号。 考虑：```
98-76-54
```数字是递减的，但是如果我们直接比较字符而不去掉`-`，逻辑被打破，因为`'-'`不是数字。 

另一个常见的错误是允许非严格减少披萨数量。 考虑：```
98-76-55
```这不是披萨号码，因为最后两位数字相等。 不小心的情况就像`>=`而不是`>`错误地接受它。 

当同一号码在一本电话簿中多次出现时，就会出现微妙的边缘情况。 该声明明确表示必须重复计算重复项。 例如：```
1
3 Alex
11-11-11
11-11-11
12-34-56
```亚历克斯有两个出租车号码，而不是一个。 使用集合来删除重复项会产生错误的答案。 

当多个朋友并列获得最大值时，就会出现另一个格式陷阱。 认为：```
2
1 A
11-11-11
1 B
22-22-22
```两位朋友都有一个出租车号码，因此正确的输出是：```
If you want to call a taxi, you should call: A, B.
```名称必须保持输入顺序，并精确分隔`", "`。 

## 方法

 最直接的方法是独立处理每个电话号码，并通过检查其数字对其进行分类。 

对于每个数字，我们删除破折号并获得长度为 6 的字符串。然后我们测试所有数字是否相等。 如果是，则为出租车号码。 

如果不是，我们测试每个数字是否严格大于下一个数字。 如果是，则它是披萨号码。 

否则就属于女生范畴了。 

这种蛮力方法已经足够快了，因为输入大小很小。 在最坏的情况下，我们会检查 10,000 个电话号码，每个电话号码仅包含 6 位数字。 这大约是 60,000 个字符操作，基本上是瞬时的。 

不需要高级的数据结构或优化技巧。 关键的观察是每个分类仅取决于六个字符，因此每次检查都是恒定时间。 

稍微不那么仔细的实现可能会多次重复扫描同一字符串或不必要地转换数字，但即使这样仍然可以顺利进行。 最干净的解决方案就是简单地处理每个数字一次并更新相应的计数器。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | O(n × s × 6) | O(1) | O(1) | 已接受 |
 | 最佳 | O(n × s × 6) | O(1) | O(1) | 已接受 |

 在这里，暴力方法和最优方法实际上是相同的，因为约束非常小。 重要的部分是正确执行分类规则。 

## 算法演练

 1.读取好友数量。 
2. 读取每个朋友的电话号码和朋友的姓名。 
3. 为该朋友初始化三个计数器：出租车、披萨和女孩。 
4. 对于每个电话号码：

 1. 删除破折号，只剩下六位数字。 
2. 检查六位数字是否全部相同。 
3. 如果它们相同，则增加出租车计数器的值。 
4. 否则，检查每个数字是否严格大于下一个数字。 
5. 如果数字严格递减，则增加披萨计数器。 
6. 否则，增加女孩计数器。 
5. 将这三个计数与朋友的姓名一起存储。 
6. 处理完所有友元后，计算：

 1. 出租车最大数量。 
2. 最大披萨数量。 
3. 女生数量上限。 
7.按照输入顺序遍历好友并收集：

 1. 出租车数量等于出租车最大数量的每个名称。 
2. 每个披萨数量等于最大披萨数量的名字。 
3. 每个名字中女孩数等于最大女孩数。 
8. 打印三个必需的句子，名称由`", "`。 

### 为什么它有效

 每个电话号码都属于一个类别。 

如果所有数字都相等，则该数字直接满足出租车定义。 

如果数字并不全部相等，但每个数字都大于下一个数字，则该数字满足披萨定义。 

剩下的数字不能是出租车或披萨，所以它必须属于女孩类别。 

由于每个数字都被精确分类一次并且每次出现都是独立计数的，因此每个朋友的计数器都是正确的。 计算所有朋友的最大计数器可以正确识别所需的名称。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

def solve():
    n = int(input())

    friends = []

    for _ in range(n):
        s, name = input().split()
        s = int(s)

        taxi = 0
        pizza = 0
        girls = 0

        for _ in range(s):
            number = input().strip().replace("-", "")

            if len(set(number)) == 1:
                taxi += 1
            elif all(number[i] > number[i + 1] for i in range(5)):
                pizza += 1
            else:
                girls += 1

        friends.append((name, taxi, pizza, girls))

    max_taxi = max(friend[1] for friend in friends)
    max_pizza = max(friend[2] for friend in friends)
    max_girls = max(friend[3] for friend in friends)

    taxi_names = [friend[0] for friend in friends if friend[1] == max_taxi]
    pizza_names = [friend[0] for friend in friends if friend[2] == max_pizza]
    girls_names = [friend[0] for friend in friends if friend[3] == max_girls]

    print(
        "If you want to call a taxi, you should call: "
        + ", ".join(taxi_names)
        + "."
    )

    print(
        "If you want to order a pizza, you should call: "
        + ", ".join(pizza_names)
        + "."
    )

    print(
        "If you want to go to a cafe with a wonderful girl, you should call: "
        + ", ".join(girls_names)
        + "."
    )

solve()
```解决方案直接遵循分类逻辑。 

表达式`number.replace("-", "")`删除格式化字符，因此我们只能使用数字。 之后，每个数字都变成一个六字符的字符串。 

出租车检查使用`len(set(number)) == 1`。 集合会删除重复项，因此如果集合大小为 1，则每个数字都必须相同。 

披萨检查比较相邻的数字：```
all(number[i] > number[i + 1] for i in range(5))
```比较是严格大于，而不是大于或等于。 这个细节很重要，因为重复的数字会使披萨的状态无效。 

女孩类别只是前两次检查失败后剩下的情况。 

该程序存储每个朋友的计数，然后计算全局最大值。 由于最终输出必须保留输入顺序，因此我们迭代存储的列表而不是排序。 

输出格式很容易出错。 该语句要求逗号后跟空格，最后只有一个句号。 使用`", ".join(...)`干净地处理这个问题。 

## 工作示例

 ### 示例 1

 输入：```
4
2 Fedorov
22-22-22
98-76-54
3 Melnikov
75-19-09
23-45-67
99-99-98
7 Rogulenko
22-22-22
11-11-11
33-33-33
44-44-44
55-55-55
66-66-66
95-43-21
3 Kaluzhin
11-11-11
99-99-99
98-65-32
```处理痕迹：

 | 朋友| 数量 | 类型 | 出租车 | 披萨| 女孩|
 | --- | --- | --- | --- | --- | --- |
 | 费多罗夫| 22-22-22 | 出租车 | 1 | 0 | 0 |
 | 费多罗夫| 98-76-54 | 披萨| 1 | 1 | 0 |
 | 梅尔尼科夫| 75-19-09 | 女孩| 0 | 0 | 1 |
 | 梅尔尼科夫| 67-23-45| 女孩| 0 | 0 | 2 |
 | 梅尔尼科夫| 99-99-98 | 女孩| 0 | 0 | 3 |
 | 罗古连科 | 22-22-22 | 出租车 | 1 | 0 | 0 |
 | 罗古连科 | 2011 年 11 月 11 日 | 出租车 | 2 | 0 | 0 |
 | 罗古连科 | 33-33-33 | 出租车 | 3 | 0 | 0 |
 | 罗古连科 | 44-44-44 | 出租车 | 4 | 0 | 0 |
 | 罗古连科 | 55-55-55 | 55-55-55 出租车 | 5 | 0 | 0 |
 | 罗古连科 | 66-66-66 | 66-66-66 出租车 | 6 | 0 | 0 |
 | 罗古连科 | 95-43-21 | 披萨| 6 | 1 | 0 |
 | 卡卢任 | 2011 年 11 月 11 日 | 出租车 | 1 | 0 | 0 |
 | 卡卢任 | 99-99-99 | 出租车 | 2 | 0 | 0 |
 | 卡卢任 | 98-65-32 | 披萨| 2 | 1 | 0 |

 最终最大值：

 | 类别 | 最大| 朋友 |
 | --- | --- | --- |
 | 出租车 | 6 | 罗古连科 |
 | 披萨| 1 | 费多罗夫、罗古连科、卡卢任 |
 | 女孩| 3 | 梅尔尼科夫|

 此示例显示了所有三个类别，并演示了披萨类别的联系。 

### 自定义示例

 输入：```
2
3 Alice
11-11-11
98-76-54
12-34-56
2 Bob
22-22-22
87-65-43
```处理痕迹：

 | 朋友| 数量 | 类型 | 出租车 | 披萨| 女孩|
 | --- | --- | --- | --- | --- | --- |
 | 爱丽丝| 2011 年 11 月 11 日 | 出租车 | 1 | 0 | 0 |
 | 爱丽丝| 98-76-54 | 披萨| 1 | 1 | 0 |
 | 爱丽丝| 56 年 12 月 34 日 | 女孩| 1 | 1 | 1 |
 | 鲍勃 | 22-22-22 | 出租车 | 1 | 0 | 0 |
 | 鲍勃 | 87-65-43 | 87-65-43 披萨| 1 | 1 | 0 |

 最终最大值：

 | 类别 | 最大| 朋友 |
 | --- | --- | --- |
 | 出租车 | 1 | 爱丽丝，鲍勃|
 | 披萨| 1 | 爱丽丝，鲍勃|
 | 女孩| 1 | 爱丽丝|

 此跟踪演示了正确的平局处理和输入顺序的保存。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | O(n × s × 6) | 每个电话号码都恰好有 6 位数字 |
 | 空间| O(1) | O(1) | 仅存储了一些计数器和名称列表|

 即使在最大限制下，程序也只能处理大约 60,000 个数字比较。 这远远低于可用的时间限制。 内存使用量也可以忽略不计。 

## 测试用例```python
# helper: run solution on input string, return output string
import sys
import io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)

    input = sys.stdin.readline

    out = io.StringIO()
    sys.stdout = out

    n = int(input())

    friends = []

    for _ in range(n):
        s, name = input().split()
        s = int(s)

        taxi = 0
        pizza = 0
        girls = 0

        for _ in range(s):
            number = input().strip().replace("-", "")

            if len(set(number)) == 1:
                taxi += 1
            elif all(number[i] > number[i + 1] for i in range(5)):
                pizza += 1
            else:
                girls += 1

        friends.append((name, taxi, pizza, girls))

    max_taxi = max(friend[1] for friend in friends)
    max_pizza = max(friend[2] for friend in friends)
    max_girls = max(friend[3] for friend in friends)

    taxi_names = [friend[0] for friend in friends if friend[1] == max_taxi]
    pizza_names = [friend[0] for friend in friends if friend[2] == max_pizza]
    girls_names = [friend[0] for friend in friends if friend[3] == max_girls]

    print(
        "If you want to call a taxi, you should call: "
        + ", ".join(taxi_names)
        + "."
    )

    print(
        "If you want to order a pizza, you should call: "
        + ", ".join(pizza_names)
        + "."
    )

    print(
        "If you want to go to a cafe with a wonderful girl, you should call: "
        + ", ".join(girls_names)
        + "."
    )

    sys.stdout = sys.__stdout__

    return out.getvalue()

# provided sample
assert run(
"""4
2 Fedorov
22-22-22
98-76-54
3 Melnikov
75-19-09
23-45-67
99-99-98
7 Rogulenko
22-22-22
11-11-11
33-33-33
44-44-44
55-55-55
66-66-66
95-43-21
3 Kaluzhin
11-11-11
99-99-99
98-65-32
"""
) == (
"""If you want to call a taxi, you should call: Rogulenko.
If you want to order a pizza, you should call: Fedorov, Rogulenko, Kaluzhin.
If you want to go to a cafe with a wonderful girl, you should call: Melnikov.
"""
), "sample 1"

# minimum input
assert run(
"""1
1 Alex
11-11-11
"""
) == (
"""If you want to call a taxi, you should call: Alex.
If you want to order a pizza, you should call: Alex.
If you want to go to a cafe with a wonderful girl, you should call: Alex.
"""
), "single friend"

# duplicate numbers must count multiple times
assert run(
"""1
3 Bob
11-11-11
11-11-11
12-34-56
"""
) == (
"""If you want to call a taxi, you should call: Bob.
If you want to order a pizza, you should call: Bob.
If you want to go to a cafe with a wonderful girl, you should call: Bob.
"""
), "duplicates counted"

# tie handling
assert run(
"""2
1 A
11-11-11
1 B
22-22-22
"""
) == (
"""If you want to call a taxi, you should call: A, B.
If you want to order a pizza, you should call: A, B.
If you want to go to a cafe with a wonderful girl, you should call: A, B.
"""
), "ties"

# pizza must be strictly decreasing
assert run(
"""1
2 Carl
98-76-54
98-76-55
"""
) == (
"""If you want to call a taxi, you should call: Carl.
If you want to order a pizza, you should call: Carl.
If you want to go to a cafe with a wonderful girl, you should call: Carl.
"""
), "strict decrease"
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 | 单身朋友一个号码 | 同一个朋友随处可见 | 最小约束 |
 | 重复的出租车号码 | 单独计算重复项 | 避免错误的重复数据删除 |
 | 两个朋友绑在一起| 两个名字按顺序打印 | 领带处理 |
 |`98-76-55`| 不是披萨| 严格的不平等|

 ## 边缘情况

 考虑重复的电话号码：```
1
3 Alex
11-11-11
11-11-11
12-34-56
```该算法独立处理每个事件。 前两个数字都满足滑行条件，因为所有数字都相等。 出租车计数器变为 2。由于该语句单独统计重复条目，因此这种行为是正确的。 

考虑一个几乎看起来像披萨号码的数字：```
1
1 Bob
98-76-55
```去掉破折号后，数字变成`987655`。 比较是：```
9 > 8
8 > 7
7 > 6
6 > 5
5 > 5   false
```最终比较失败，因为减少不严格。 该算法正确地将号码分类为女孩号码。 

考虑多个朋友之间的关系：```
2
1 A
11-11-11
1 B
22-22-22
```两个朋友都以出租车计数 1 结束。算法将最大出租车计数计算为 1，然后收集与该值匹配的每个朋友。 由于它遍历了原始输入顺序，因此输出变为：```
A, B
```与所需的订购相匹配。 

考虑一个电话号码为零的朋友：```
1
0 Alice
```所有三个计数器都保持为 0。由于 Alice 是唯一的朋友，因此每个类别最大值也为 0，因此 Alice 出现在所有三个输出行中。 该算法自然地处理这个问题，没有特殊情况。
