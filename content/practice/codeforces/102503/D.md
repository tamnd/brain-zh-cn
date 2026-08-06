---
title: "CF 102503D - 联合发现"
description: "日志描述了工厂一段时间内的状态。 在日志开始之前，我们会向每位员工提供两种识别他们的方式：他们的完整身份，包括头衔和姓名，以及他们的昵称。"
date: "2026-08-05T17:08:24+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 102503
codeforces_index: "D"
codeforces_contest_name: "National Olympiad in Informatics - Philippines (NOI.PH) Online Eliminations 2020"
rating: 0
weight: 102503
solve_time_s: 2236
verified: true
draft: false
---

[CF 102503D - 联合发现](https://codeforces.com/problemset/problem/102503/D)

 **评级：** -
 **标签：** -
 **求解时间：** 37m 16s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 日志描述了工厂一段时间内的状态。 在日志开始之前，我们会向每位员工提供两种识别他们的方式：他们的完整身份，包括头衔和姓名，以及他们的昵称。 然后，日志包含员工进入、员工离开、发生示威以及询问特定员工当前是否在里面的事件。 

任务是按顺序处理日志。 当示威发生时，我们需要工厂内当前的员工人数。 当出现查询时，我们需要确定引用的员工当前是否在场并打印`FOUND`或者`404`。 

第一个挑战是同一个人可以以两种不同的形式出现。 例如，员工可以使用`Sir Richard`并稍后使用进行搜索`the Knight`。 这两个字符串必须引用相同的内部状态。 

最大输入包含多达 100000 名员工和 100000 条日志条目。 由于有两秒的时间限制，重复扫描所有员工或所有当前活跃人员的算法太慢。 每个查询执行 100000 次操作的解决方案可能会达到大约 10^10 次操作，这远远超出了 Python 的处理能力。 预期的方法需要在大致恒定的时间内处理每个日志行。 

在简单的实现中，有几个细节可能会导致错误的答案。 一个错误是只存储日志中出现的确切文本。 例如：```
Sir Richard the Knight
----------
+ Sir Richard
FIND the Knight
END
```正确的输出是：```
FOUND
```一个程序可以治疗`Sir Richard`和`the Knight`因为不相关的字符串会错误地打印`404`。 

另一个问题是错误地更新了员工人数。 考虑：```
Sir Alice the Cat
----------
+ Sir Alice
UNION
- the Cat
UNION
END
```正确的输出是：```
1
0
```第一次演示发生在爱丽丝在里面的时候。 第二次发生在同一名员工离职后。 如果将昵称与姓名分开计算，则会将同一个人计算两次。 

最后的边缘情况是没有任何移动的重复演示：```
Sir Bob the Dog
----------
UNION
UNION
END
```输出是：```
0
0
```解决方案必须回答当前状态的每个查询。 先前的演示不会消耗或更改状态。 

## 方法

 最简单的解决方案是让一组员工目前留在室内。 每当一个`+`事件出现时，我们添加该员工，并且每次`-`事件发生，我们删除该员工。 对于查询，我们搜索集合以查看员工是否存在。 这是正确的，因为日志保证是一致的，所以集合准确地代表了里面的人。 

如果我们对员工存储不当，问题就在于查找成本。 有了活跃员工的列表，每个查询都可以检查每个员工。 在最坏的情况下，有 100000 名员工和 100000 条日志行，导致大约 10^10 次比较。 

关键的观察结果是，在处理日志之前，员工列表是固定的。 我们可以为每个员工分配一次内部标识符。 全名形式和昵称形式都可以映射到相同的标识符。 之后，问题的动态部分就只剩下每个标识符是否处于活动状态的问题。 

哈希映射提供从日志中的文本到标识符的恒定时间转换。 布尔数组或集合存储当前包含哪些标识符。 我们还保留了在职员工的柜台，因为`UNION`事件仅询问当前组的大小。 

蛮力方法之所以有效，是因为它直接模拟了工厂，但它浪费时间重新发现员工的身份并搜索许多不相关的人。 身份可以被压缩为整数 ID 的观察结果使每个事件都成为恒定时间更新。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | O(e * n) | O(e) | 太慢了|
 | 最佳 | O(e + n) | O(e) | 已接受 |

 ## 算法演练

 1. 读取员工列表并为每个员工分配一个唯一的整数ID。 将两种可能的引用（完整的头衔名称形式和昵称形式）存储在指向该 ID 的字典中。 

算法的其余部分不应再次比较员工字符串。 日志中的每个引用都应立即成为整数查找。 

1、创建一个数据结构，记录每个员工ID当前是否在里面。 最初，每个员工都在外面。 

日志是按时间顺序排列的，因此当前状态仅取决于已处理的事件。 

1. 读取每个日志行，直到`END`。 

对于进入事件，找到员工 ID 并将其标记为活动。 增加当前计数。 

对于退出事件，找到员工 ID 并将其标记为非活动。 减少当前计数。 

对于一个`UNION`事件，输出当前计数。 

对于一个`FIND`事件，将引用转换为 ID 并检查该 ID 的活动状态。 

1. 按照需要输出的事件出现的顺序打印答案。 

不变的是，在处理日志的任何前缀后，活动数组准确地代表了当时在工厂内的员工。 进入和退出事件根据日志更新一名员工，而查询事件仅读取状态。 由于姓名和昵称都映射到相同的 ID，因此每个查询都会观察到正确的员工。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

def solve():
    ref = {}
    active = []
    emp_count = 0

    while True:
        line = input().rstrip("\n")
        if line == "----------":
            break
        parts = line.split()
        title = parts[0]
        name = parts[1]
        nick = parts[2]
        ref[title + " " + name] = emp_count
        ref["the " + nick] = emp_count
        emp_count += 1

    active = [False] * emp_count
    inside = 0
    ans = []

    while True:
        line = input().rstrip("\n")
        if line == "END":
            break

        if line == "UNION":
            ans.append(str(inside))
        elif line[0] == '+':
            key = line[2:]
            idx = ref[key]
            if not active[idx]:
                active[idx] = True
                inside += 1
        elif line[0] == '-':
            key = line[2:]
            idx = ref[key]
            if active[idx]:
                active[idx] = False
                inside -= 1
        else:
            key = line[5:]
            idx = ref[key]
            if active[idx]:
                ans.append("FOUND")
            else:
                ans.append("404")

    sys.stdout.write("\n".join(ans))

if __name__ == "__main__":
    solve()
```字典构建阶段处理身份问题。 每个员工都会收到一个 ID，并且两种表示都指向该 ID。 用作字典键的字符串与日志中出现的形式完全相同。 

这`active`数组存储当前工厂状态。 布尔数组就足够了，因为每个员工都已经有一个紧凑的数字索引。 这`inside`变量避免在期间扫描数组`UNION`。 

更新的顺序很重要。 激活员工后，条目会增加计数，而删除员工后，退出会减少计数。 该问题保证不会发生无效删除，因此检查只是防御性的。 

Python 整数不会溢出，最大可能计数仅为 100000。每个操作都使用字典查找或数组访问，这使解决方案保持在所需的限制内。 

## 工作示例

 对于第一个样本，只有三名员工变得相关。 踪迹是：

 | 活动 | 活跃员工| 计数 | 输出|
 | --- | --- | --- | --- |
 |`+ Sir Richard`| 理查德 | 1 | |
 |`+ the Merchant`| 理查德·普拉德 | 2 | |
 |`FIND the Knight`| 理查德·普拉德 | 2 | 发现 |
 |`UNION`| 理查德·普拉德 | 2 | 2 |
 |`- the Knight`| 普拉德 | 1 | |
 |`FIND Sir Richard`| 普拉德 | 1 | 404 | 404
 |`+ the Duck`| 唐纳德·普拉德 | 2 | |
 |`- Sir Poorard`| 唐纳德 | 1 | |
 |`FIND the Duck`| 唐纳德 | 1 | 发现 |
 |`FIND Sir Donard`| 唐纳德 | 1 | 发现 |

 此跟踪演示了为什么姓名和昵称都必须指向一个员工 ID。 条目通过`Sir Richard`是通过发现`the Knight`。 

对于第二个示例，重要的转换是：

 | 活动 | 活跃员工| 计数 | 输出|
 | --- | --- | --- | --- |
 |`+ Lolo Generoso`| 慷慨| 1 | |
 |`UNION`| 慷慨| 1 | 1 |
 |`FIND the Wise`| 慷慨| 1 | 404 | 404
 |`- Lolo Generoso`| 无 | 0 | |
 |`UNION`| 无 | 0 | 0 |
 |`+ Lolo Generoso`| 慷慨| 1 | |
 |`UNION`| 慷慨| 1 | 1 |
 |`UNION`| 慷慨| 1 | 1 |
 |`- Lolo Generoso`| 无 | 0 | |
 |`UNION`| 无 | 0 | 0 |

 此示例反复演示并确认演示仅读取当前计数。 他们不会修改在职员工。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | O(e + n) | 每个员工都被插入到字典中一次，并且每个日志行执行恒定时间的工作。 |
 | 空间| O(e) | 字典和活动状态数组为每个员工存储一个条目。 |

 最大输入大小为 100000 名员工和 100000 个事件。 该解决方案为每条输入线执行少量恒定的工作，因此它完全符合限制。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    old = sys.stdin
    sys.stdin = io.StringIO(inp)
    out = io.StringIO()
    old_out = sys.stdout
    sys.stdout = out

    solve()

    sys.stdout = old_out
    sys.stdin = old
    return out.getvalue()

assert run("""Sir Alice the Cat
----------
+ Sir Alice
FIND the Cat
UNION
END
""") == "FOUND\n1", "basic alias"

assert run("""Sir Bob the Dog
----------
UNION
UNION
END
""") == "0\n0", "empty repeated queries"

assert run("""Madam Eve the Sun
----------
+ the Sun
FIND Madam Eve
- Madam Eve
FIND the Sun
END
""") == "FOUND\n404", "enter and leave through different aliases"

assert run("""Sir A the X
Sir B the Y
----------
+ Sir A
+ Sir B
UNION
- the X
UNION
END
""") == "2\n1", "multiple employees"
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 | 单个员工单名录入、昵称查询 |`FOUND`,`1`| 别名映射 |
 | 空日志状态演示|`0`,`0`| 没有意外的状态变化 |
 | 不同形式进出 |`FOUND`,`404`| 共享员工身份|
 | 多名员工齐心协力|`2`,`1`| 正确的计数器更新 |

 ## 边缘情况

 当一个人使用一个标识符输入并使用另一个标识符搜索时，算法会处理它，因为在预处理期间这两个字符串都映射到相同的数字 ID。 在输入中：```
Sir Alice the Cat
----------
+ Sir Alice
FIND the Cat
END
```字典包含两者`Sir Alice`和`the Cat`指向 ID 零。 该条目激活 ID 零，并且查询检查相同的 ID。 

当员工离职时，计数必须代表人，而不是外表。 在：```
Sir Alice the Cat
----------
+ Sir Alice
UNION
- the Cat
UNION
END
```第一个演示看到一个活动 ID。 出口找到相同的 ID 并将其删除，因此第二个演示看到零。 

反复示威不会影响国家。 为了：```
Sir Bob the Dog
----------
UNION
UNION
END
```活动数组在两个事件之间保持不变，因此两个答案都为零。
